from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest , ChatResponse , ProjectHistoryResponse
from app.services.chat_service import project_chat_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat/{project_id}", response_model=ChatResponse)
async def chat_with_project(project_id: str, request: ChatRequest):
    """
    Interface de chat pour modifier un projet existant
    
    Args:
        project_id: ID du projet à modifier
        request: Message utilisateur
        
    Returns:
        ChatResponse: Réponse avec projet modifié
    """
    try:
        response = await project_chat_service.process_chat_message(
            project_id=project_id,
            user_message=request.message
        )
        return response
        
    except Exception as e:
        logger.error(f"Erreur dans le chat pour le projet {project_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement du message: {str(e)}"
        )

@router.get("/chat/{project_id}/history", response_model=ProjectHistoryResponse)
async def get_chat_history(project_id: str):
    """
    Récupère l'historique des messages d'un projet
    
    Args:
        project_id: ID du projet
        
    Returns:
        ProjectHistoryResponse: Historique des messages
    """
    try:
        chat_history = project_chat_service.get_chat_history(project_id)
        current_project = project_chat_service.get_project(project_id)
        
        if current_project is None:
            raise HTTPException(
                status_code=404,
                detail="Projet non trouvé"
            )
        
        return ProjectHistoryResponse(
            success=True,
            project_id=project_id,
            chat_history=chat_history,
            current_project=current_project
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de l'historique: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne: {str(e)}"
        )

@router.post("/projects/{project_id}/store")
async def store_generated_project(project_id: str, project_data: dict):
    """
    Stocke un projet généré pour permettre les modifications via chat
    
    Args:
        project_id: ID unique du projet
        project_data: Données du projet généré
        
    Returns:
        dict: Confirmation du stockage
    """
    try:
        project_chat_service.store_project(project_id, project_data)
        return {
            "success": True,
            "message": f"Projet {project_id} stocké avec succès",
            "project_id": project_id
        }
        
    except Exception as e:
        logger.error(f"Erreur lors du stockage du projet: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du stockage: {str(e)}"
        )

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """
    Récupère un projet par son ID
    
    Args:
        project_id: ID du projet
        
    Returns:
        dict: Données du projet
    """
    try:
        project_data = project_chat_service.get_project(project_id)
        
        if project_data is None:
            raise HTTPException(
                status_code=404,
                detail="Projet non trouvé"
            )
        
        return {
            "success": True,
            "project_id": project_id,
            "project_data": project_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du projet: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne: {str(e)}"
        )