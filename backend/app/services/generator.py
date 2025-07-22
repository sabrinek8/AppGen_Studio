import json
import logging
from app.models.schemas import ProjectRequest, ProjectResponse
from app.agents.frontend_generator_agent import frontend_generator_agent,create_react_native_web_task
from crewai import Crew

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

async def generate_react_project(request: ProjectRequest) -> ProjectResponse:
    try:
        logger.info(f"Génération d'un projet React pour : {request.description}")
        task = create_react_native_web_task(request.description, request.features)
        crew = Crew(agents=[frontend_generator_agent], tasks=[task], verbose=True)
        result = crew.kickoff()
        result_str = str(result.output).strip() if hasattr(result, "output") else str(result).strip()
        project_data = extract_json_from_output(result_str)
        return ProjectResponse(success=True, project_data=project_data)
    except ValueError as e:
        return ProjectResponse(success=False, error=str(e))
    except Exception as e:
        logger.exception("Erreur inattendue")
        return ProjectResponse(success=False, error=f"Erreur interne : {str(e)}")
