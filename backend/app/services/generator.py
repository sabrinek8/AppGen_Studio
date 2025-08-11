import json
import logging
from app.models.schemas import ProjectRequest, ProjectResponse
from app.agents.frontend_generator_agent import frontend_generator_agent, create_react_native_web_task
from crewai import Crew
from app.services.chat_service import project_chat_service
from app.evaluation.simple_evaluator import SimpleFrontendEvaluator
import uuid
import asyncio
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

def extract_json_from_output(output_str: str):
    try:
        output_str = output_str.strip()
        first_brace = output_str.find("{")
        last_brace = output_str.rfind("}")
        if first_brace == -1 or last_brace == -1:
            raise ValueError("Aucun JSON détecté dans la sortie")
        json_str = output_str[first_brace:last_brace+1]
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        logger.error(f"Erreur de parsing JSON : {e}")
        raise ValueError(f"JSON invalide : {e}")
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction JSON : {e}")
        raise ValueError(f"Erreur d'extraction : {e}")

def evaluate_project_sync(project_data: dict, test_case: dict) -> dict:
    """
    Synchronous evaluation function to run in thread pool
    """
    try:
        evaluator = SimpleFrontendEvaluator()
        
        # Create test case from project request
        evaluation_result = evaluator._llm_judge_evaluation(test_case, project_data)
        
        # Log individual project evaluation to MLflow
        import mlflow
        
        # Check if there's an active run, if not start one
        active_run = mlflow.active_run()
        if active_run is None:
            # Set or create experiment for individual project evaluations
            try:
                experiment = mlflow.get_experiment_by_name("Project_Generation_Evaluation")
                if experiment is None:
                    experiment_id = mlflow.create_experiment("Project_Generation_Evaluation")
                else:
                    experiment_id = experiment.experiment_id
                mlflow.set_experiment(experiment_id=experiment_id)
            except Exception as e:
                logger.warning(f"Could not set MLflow experiment: {e}")
            
            # Start new run for this project
            with mlflow.start_run():
                # Log project metadata
                mlflow.log_param("description", test_case.get("description", ""))
                mlflow.log_param("features", test_case.get("features", ""))
                mlflow.log_param("files_count", len(project_data))
                mlflow.log_param("project_type", "single_generation")
                
                # Log evaluation metrics
                mlflow.log_metric("overall_score", evaluation_result["overall_score"])
                mlflow.log_metric("code_quality", evaluation_result["code_quality"])
                mlflow.log_metric("requirements_fulfillment", evaluation_result["requirements_fulfillment"])
                mlflow.log_metric("compliance", evaluation_result["compliance"])
                
                # Log feedback as text
                mlflow.log_text(evaluation_result["feedback"], "evaluation_feedback.txt")
                
                # Log file names
                file_names = list(project_data.keys())
                mlflow.log_text("\n".join(file_names), "generated_files.txt")
                
                logger.info(f"Project evaluation logged to MLflow - Overall Score: {evaluation_result['overall_score']:.2f}")
        
        return evaluation_result
        
    except Exception as e:
        logger.error(f"Error during project evaluation: {e}")
        return {
            "overall_score": 0,
            "code_quality": 0, 
            "requirements_fulfillment": 0,
            "compliance": 0,
            "feedback": f"Evaluation failed: {str(e)}"
        }

async def evaluate_project_async(project_data: dict, description: str, features: str) -> dict:
    """
    Asynchronous wrapper for project evaluation
    """
    test_case = {
        "description": description,
        "features": features
    }
    
    # Run evaluation in thread pool to avoid blocking
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=1) as executor:
        evaluation_result = await loop.run_in_executor(
            executor, 
            evaluate_project_sync, 
            project_data, 
            test_case
        )
    
    return evaluation_result

async def generate_react_project(request: ProjectRequest) -> ProjectResponse:
    try:
        logger.info(f"Génération d'un projet React pour : {request.description}")
        
        # Generate the project
        task = create_react_native_web_task(request.description, request.features)
        crew = Crew(agents=[frontend_generator_agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        result_str = str(result.output).strip() if hasattr(result, "output") else str(result).strip()
        project_data = extract_json_from_output(result_str)
        
        # Generate unique project ID and store the project
        project_id = str(uuid.uuid4())
        project_chat_service.store_project(project_id, project_data)
        
        # Automatically evaluate the generated project
        logger.info("Starting automatic evaluation of generated project...")
        
        try:
            evaluation_result = await evaluate_project_async(
                project_data, 
                request.description, 
                request.features or ""
            )
            
            logger.info(f"Project evaluated - Score: {evaluation_result['overall_score']:.2f}/10")
            
            # Include evaluation in response (optional)
            response_data = {
                "project_id": project_id, 
                "files": project_data,
                "evaluation": {
                    "overall_score": evaluation_result["overall_score"],
                    "weighted_score": evaluation_result.get("weighted_score", evaluation_result["overall_score"]),  # New field
                    "code_quality": evaluation_result["code_quality"],
                    "requirements_fulfillment": evaluation_result["requirements_fulfillment"],
                    "compliance": evaluation_result["compliance"],
                    "feedback": evaluation_result["feedback"],
                    "weights_info": "Requirements: 50%, Code Quality: 25%, Compliance: 25%"  # Info for users
                }
            }
        except Exception as eval_error:
            logger.error(f"Evaluation failed, but project generation succeeded: {eval_error}")
            # Still return the project even if evaluation fails
            response_data = {
                "project_id": project_id, 
                "files": project_data,
                "evaluation": {
                    "overall_score": 0,
                    "error": f"Evaluation failed: {str(eval_error)}"
                }
            }
        
        return ProjectResponse(
            success=True, 
            project_data=response_data
        )
        
    except ValueError as e:
        return ProjectResponse(success=False, error=str(e))
    except Exception as e:
        logger.exception("Erreur inattendue")
        return ProjectResponse(success=False, error=f"Erreur interne : {str(e)}")