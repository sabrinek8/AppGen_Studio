import mlflow
import json
import logging
import os
import tempfile
from datetime import datetime
from typing import Dict, List, Any
from app.core.ClaudeLLM import ClaudeLLM
from app.agents.frontend_generator_agent import frontend_generator_agent, create_react_native_web_task
from crewai import Crew

logger = logging.getLogger(__name__)

class SimpleFrontendEvaluator:
    def __init__(self):
        self.llm_judge = ClaudeLLM()
        # Set or create experiment
        try:
            experiment = mlflow.get_experiment_by_name("Frontend_Generator_Evaluation")
            if experiment is None:
                experiment_id = mlflow.create_experiment("Frontend_Generator_Evaluation")
            else:
                experiment_id = experiment.experiment_id
            mlflow.set_experiment(experiment_id=experiment_id)
        except Exception as e:
            logger.warning(f"Could not set MLflow experiment: {e}")
    
    def evaluate_agent(self, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate the frontend generator agent using basic MLflow logging
        """
        # Validate test cases first
        validated_test_cases = self._validate_test_cases(test_cases)
        
        with mlflow.start_run():
            # Log basic info
            mlflow.log_param("test_cases_count", len(validated_test_cases))
            mlflow.log_param("evaluation_date", datetime.now().isoformat())
            
            results = []
            
            for i, test_case in enumerate(validated_test_cases):
                logger.info(f"Evaluating test case {i+1}/{len(test_cases)}")
                
                try:
                    # Validate test case structure
                    if not isinstance(test_case, dict):
                        raise ValueError(f"Test case {i} is not a dictionary: {type(test_case)}")
                    
                    if 'description' not in test_case:
                        raise ValueError(f"Test case {i} missing 'description' field. Available keys: {list(test_case.keys())}")
                    
                    description = test_case['description']
                    features = test_case.get('features', '')
                    
                    logger.info(f"Test case {i}: {description}")
                    
                    # Generate project
                    generated_project = self._generate_project(description, features)
                    
                    # Evaluate with LLM judge
                    evaluation_score = self._llm_judge_evaluation(test_case, generated_project)
                    
                    # Store results
                    result = {
                        'test_case_id': i,
                        'description': description,
                        'features': features,
                        'generated_files_count': len(generated_project),
                        'evaluation_score': evaluation_score['overall_score'],
                        'code_quality_score': evaluation_score['code_quality'],
                        'requirements_fulfillment': evaluation_score['requirements_fulfillment'],
                        'react_native_web_compliance': evaluation_score['compliance'],
                        'feedback': evaluation_score['feedback']
                    }
                    results.append(result)
                    
                    # Log individual test case metrics
                    mlflow.log_metric(f"test_{i}_overall_score", evaluation_score['overall_score'])
                    mlflow.log_metric(f"test_{i}_code_quality", evaluation_score['code_quality'])
                    mlflow.log_metric(f"test_{i}_requirements", evaluation_score['requirements_fulfillment'])
                    mlflow.log_metric(f"test_{i}_compliance", evaluation_score['compliance'])
                    mlflow.log_metric(f"test_{i}_files_count", len(generated_project))
                    
                except Exception as e:
                    logger.error(f"Error evaluating test case {i}: {e}")
                    logger.error(f"Test case content: {test_case}")
                    
                    # Try to get description safely
                    description = test_case.get('description', f'Test case {i}') if isinstance(test_case, dict) else f'Invalid test case {i}'
                    features = test_case.get('features', '') if isinstance(test_case, dict) else ''
                    
                    # Log failed test case
                    results.append({
                        'test_case_id': i,
                        'description': description,
                        'features': features,
                        'generated_files_count': 0,
                        'evaluation_score': 0,
                        'code_quality_score': 0,
                        'requirements_fulfillment': 0,
                        'react_native_web_compliance': 0,
                        'feedback': f"Evaluation failed: {str(e)}"
                    })
            
            # Calculate and log overall metrics
            overall_metrics = self._calculate_overall_metrics(results)
            for metric_name, metric_value in overall_metrics.items():
                mlflow.log_metric(metric_name, metric_value)
            
            # Save results as artifact
            self._save_results_as_artifact(results)
            
            return {
                'results': results,
                'overall_metrics': overall_metrics
            }
    
    def _validate_test_cases(self, test_cases: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Validate and fix test cases structure"""
        validated = []
        
        for i, test_case in enumerate(test_cases):
            try:
                if not isinstance(test_case, dict):
                    logger.warning(f"Test case {i} is not a dict, converting: {test_case}")
                    # Try to convert string to dict if it looks like one
                    if isinstance(test_case, str):
                        try:
                            test_case = json.loads(test_case)
                        except:
                            # Create a basic test case from string
                            test_case = {"description": test_case, "features": ""}
                    else:
                        test_case = {"description": str(test_case), "features": ""}
                
                # Ensure required fields exist
                if 'description' not in test_case or not test_case['description']:
                    test_case['description'] = f"Test case {i} - no description provided"
                
                if 'features' not in test_case:
                    test_case['features'] = ""
                
                validated.append(test_case)
                logger.info(f"Validated test case {i}: {test_case['description']}")
                
            except Exception as e:
                logger.error(f"Error validating test case {i}: {e}")
                # Create fallback test case
                validated.append({
                    "description": f"Fallback test case {i}",
                    "features": ""
                })
        
        return validated
    
    def _generate_project(self, description: str, features: str = "") -> Dict[str, str]:
        """Generate project using the frontend generator agent"""
        try:
            task = create_react_native_web_task(description, features)
            crew = Crew(agents=[frontend_generator_agent], tasks=[task], verbose=False)
            result = crew.kickoff()
            result_str = str(result.output).strip() if hasattr(result, "output") else str(result).strip()
            
            # Extract JSON
            first_brace = result_str.find("{")
            last_brace = result_str.rfind("}")
            if first_brace == -1 or last_brace == -1:
                return {}
            json_str = result_str[first_brace:last_brace+1]
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Error generating project: {e}")
            return {}
    
    def _llm_judge_evaluation(self, test_case: Dict[str, Any], generated_project: Dict[str, str]) -> Dict[str, Any]:
        """Use LLM as judge to evaluate the generated project"""
        
        if not generated_project:
            return {
                "code_quality": 0,
                "requirements_fulfillment": 0,
                "compliance": 0,
                "overall_score": 0,
                "feedback": "No project generated"
            }
        
        # Prepare project content for evaluation (limit size for LLM)
        project_content = ""
        file_count = 0
        for file_path, file_content in generated_project.items():
            if file_count < 5:  # Limit to first 5 files to avoid token limits
                project_content += f"\n--- {file_path} ---\n{file_content[:1000]}...\n"
                file_count += 1
            else:
                project_content += f"\n--- {file_path} --- (truncated)\n"
        
        evaluation_prompt = f"""
Evaluate this React Native Web project generation:

USER REQUEST:
Description: {test_case['description']}
Features: {test_case.get('features', 'None specified')}

GENERATED PROJECT ({len(generated_project)} files):
{project_content}

EVALUATION CRITERIA (Score 1-10 each):

1. CODE QUALITY: Clean code, proper structure, correct syntax
2. REQUIREMENTS FULFILLMENT: Matches user description and features  
3. REACT NATIVE WEB COMPLIANCE: Proper react-native-web usage

RESPOND ONLY WITH THIS JSON:
{{
    "code_quality": <score 1-10>,
    "requirements_fulfillment": <score 1-10>, 
    "compliance": <score 1-10>,
    "overall_score": <average of above>,
    "feedback": "<brief explanation>"
}}
"""
        
        try:
            # Debug: Check available methods
            available_methods = [method for method in dir(self.llm_judge) if not method.startswith('_')]
            logger.info(f"Available LLM methods: {available_methods}")
            
            # Your ClaudeLLM uses call() method with OpenAI chat format
            logger.info("Attempting to call LLM with messages format...")
            messages = [{"role": "user", "content": evaluation_prompt}]
            response = self.llm_judge.call(messages)
            logger.info(f"LLM call successful, response type: {type(response)}")
            
            if response is None:
                raise ValueError("LLM returned None response")
            
            response_str = str(response).strip()
            logger.info(f"LLM Response: {response_str[:200]}...")  # Log first 200 chars
            
            # Extract JSON from response
            first_brace = response_str.find("{")
            last_brace = response_str.rfind("}")
            if first_brace != -1 and last_brace != -1:
                json_str = response_str[first_brace:last_brace+1]
                evaluation = json.loads(json_str)
                
                # Ensure all required fields exist and are valid
                required_fields = ["code_quality", "requirements_fulfillment", "compliance", "overall_score", "feedback"]
                for field in required_fields:
                    if field not in evaluation:
                        if field == "feedback":
                            evaluation[field] = "No feedback provided"
                        else:
                            evaluation[field] = 5  # Default score
                
                # Validate numeric scores
                for field in ["code_quality", "requirements_fulfillment", "compliance", "overall_score"]:
                    if field in evaluation:
                        try:
                            evaluation[field] = float(evaluation[field])
                            # Ensure score is within valid range
                            evaluation[field] = max(1, min(10, evaluation[field]))
                        except (ValueError, TypeError):
                            evaluation[field] = 5  # Default score
                
                # Calculate overall score if not provided or invalid
                scores = [evaluation["code_quality"], evaluation["requirements_fulfillment"], evaluation["compliance"]]
                if not isinstance(evaluation["overall_score"], (int, float)) or evaluation["overall_score"] <= 0:
                    evaluation["overall_score"] = sum(scores) / len(scores)
                
                logger.info(f"Parsed evaluation: {evaluation}")
                return evaluation
            else:
                logger.warning(f"No JSON found in response: {response_str}")
                
        except Exception as e:
            logger.error(f"Error in LLM evaluation: {e}")
            logger.error(f"Available methods on LLM: {[method for method in dir(self.llm_judge) if not method.startswith('_')]}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        
        # Fallback evaluation
        return {
            "code_quality": 3,
            "requirements_fulfillment": 3,
            "compliance": 3,
            "overall_score": 3,
            "feedback": f"Evaluation failed, but project generated with {len(generated_project)} files"
        }
    
    def _calculate_overall_metrics(self, results: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate overall performance metrics"""
        if not results:
            return {}
        
        total_cases = len(results)
        successful_cases = [r for r in results if r['evaluation_score'] > 0]
        
        if not successful_cases:
            return {
                'total_test_cases': total_cases,
                'successful_cases': 0,
                'failure_rate': 1.0,
                'avg_overall_score': 0,
                'avg_code_quality': 0,
                'avg_requirements_fulfillment': 0,
                'avg_compliance': 0,
                'success_rate': 0,
                'generated_files_avg': 0
            }
        
        metrics = {
            'total_test_cases': total_cases,
            'successful_cases': len(successful_cases),
            'failure_rate': (total_cases - len(successful_cases)) / total_cases,
            'avg_overall_score': sum(r['evaluation_score'] for r in successful_cases) / len(successful_cases),
            'avg_code_quality': sum(r['code_quality_score'] for r in successful_cases) / len(successful_cases),
            'avg_requirements_fulfillment': sum(r['requirements_fulfillment'] for r in successful_cases) / len(successful_cases),
            'avg_compliance': sum(r['react_native_web_compliance'] for r in successful_cases) / len(successful_cases),
            'success_rate': sum(1 for r in successful_cases if r['evaluation_score'] >= 7) / len(successful_cases),
            'generated_files_avg': sum(r['generated_files_count'] for r in results) / total_cases
        }
        
        return metrics
    
    def _save_results_as_artifact(self, results: List[Dict[str, Any]]):
        """Save evaluation results as MLflow artifact"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                json.dump(results, f, indent=2)
                temp_file = f.name
            
            # Log as artifact
            mlflow.log_artifact(temp_file, "evaluation_results.json")
            
            # Clean up
            os.unlink(temp_file)
            
        except Exception as e:
            logger.error(f"Error saving results as artifact: {e}")

# Simple test cases
SIMPLE_TEST_CASES = [
    {
        "description": "Todo list application",
        "features": "Add, delete, mark tasks as complete"
    },
    {
        "description": "Simple calculator", 
        "features": "Basic arithmetic operations"
    },
    {
        "description": "Counter app",
        "features": "Increment, decrement, reset counter"
    }
]

# Simple usage function
def run_simple_evaluation():
    """Run evaluation with simple test cases"""
    evaluator = SimpleFrontendEvaluator()
    results = evaluator.evaluate_agent(SIMPLE_TEST_CASES)
    
    print("=== EVALUATION COMPLETED ===")
    if results['overall_metrics']:
        metrics = results['overall_metrics']
        print(f"Total Test Cases: {metrics.get('total_test_cases', 0)}")
        print(f"Successful Cases: {metrics.get('successful_cases', 0)}")
        print(f"Overall Score: {metrics.get('avg_overall_score', 0):.2f}/10")
        print(f"Success Rate: {metrics.get('success_rate', 0):.2%}")
        print(f"Code Quality: {metrics.get('avg_code_quality', 0):.2f}/10")
    else:
        print("No metrics available")
    
    return results

if __name__ == "__main__":
    run_simple_evaluation()