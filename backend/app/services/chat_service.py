import json
import logging
from typing import Dict, Any, List, Optional
from app.models.schemas import ChatMessage, ChatResponse
from app.agents.chat_modification_agent import chat_modification_agent, create_modification_task
from crewai import Crew

logger = logging.getLogger(__name__)

class ProjectChatService:
    def __init__(self):
        # En mémoire pour cette implémentation - en production, utiliser une base de données
        self.projects_store: Dict[str, Dict[str, Any]] = {}
        self.chat_history: Dict[str, List[ChatMessage]] = {}
    
    def store_project(self, project_id: str, project_data: Dict[str, str]) -> None:
        """Stocke un projet généré"""
        self.projects_store[project_id] = {
            "current_project": project_data,
            "version": 1
        }
        # Initialiser l'historique de chat
        if project_id not in self.chat_history:
            self.chat_history[project_id] = []
        
        logger.info(f"Projet {project_id} stocké avec {len(project_data)} fichiers")
    
    def get_project(self, project_id: str) -> Optional[Dict[str, str]]:
        """Récupère le projet actuel par ID"""
        if project_id in self.projects_store:
            return self.projects_store[project_id]["current_project"]
        return None
    
    def get_chat_history(self, project_id: str) -> List[ChatMessage]:
        """Récupère l'historique des messages d'un projet"""
        return self.chat_history.get(project_id, [])
    
    def add_message_to_history(self, project_id: str, message: ChatMessage) -> None:
        """Ajoute un message à l'historique"""
        if project_id not in self.chat_history:
            self.chat_history[project_id] = []
        self.chat_history[project_id].append(message)
    
    async def process_chat_message(self, project_id: str, user_message: str) -> ChatResponse:
        """
        Traite un message utilisateur et modifie le projet si nécessaire
        
        Args:
            project_id: ID du projet à modifier
            user_message: Message de l'utilisateur
            
        Returns:
            ChatResponse: Réponse avec le projet modifié ou un message d'erreur
        """
        try:
            # Vérifier que le projet existe
            current_project = self.get_project(project_id)
            if not current_project:
                return ChatResponse(
                    success=False,
                    message="Projet non trouvé. Veuillez d'abord générer un projet.",
                    error="PROJECT_NOT_FOUND"
                )
            
            # Ajouter le message utilisateur à l'historique
            user_msg = ChatMessage(role="user", content=user_message)
            self.add_message_to_history(project_id, user_msg)
            
            logger.info(f"Traitement du message pour le projet {project_id}: {user_message}")
            
            # Créer la tâche de modification
            modification_task = create_modification_task(user_message, current_project)
            crew = Crew(agents=[chat_modification_agent], tasks=[modification_task], verbose=True)
            
            # Exécuter la modification
            result = crew.kickoff()
            result_str = str(result.output).strip() if hasattr(result, "output") else str(result).strip()
            
            # Extraire le JSON modifié
            modified_project = self._extract_json_from_output(result_str)
            
            # Mettre à jour le projet stocké
            self.projects_store[project_id]["current_project"] = modified_project
            self.projects_store[project_id]["version"] += 1
            
            # Générer une réponse utilisateur amicale
            bot_response = self._generate_friendly_response(user_message, modified_project)
            
            # Ajouter la réponse du bot à l'historique
            bot_msg = ChatMessage(role="assistant", content=bot_response)
            self.add_message_to_history(project_id, bot_msg)
            
            return ChatResponse(
                success=True,
                message=bot_response,
                updated_project=modified_project,
                project_version=self.projects_store[project_id]["version"]
            )
            
        except ValueError as e:
            error_msg = f"Erreur lors de la modification : {str(e)}"
            bot_msg = ChatMessage(role="assistant", content=error_msg)
            self.add_message_to_history(project_id, bot_msg)
            
            return ChatResponse(
                success=False,
                message=error_msg,
                error="MODIFICATION_ERROR"
            )
        except Exception as e:
            logger.exception("Erreur inattendue lors du traitement du chat")
            error_msg = "Désolé, une erreur inattendue s'est produite. Pouvez-vous reformuler votre demande ?"
            
            bot_msg = ChatMessage(role="assistant", content=error_msg)
            self.add_message_to_history(project_id, bot_msg)
            
            return ChatResponse(
                success=False,
                message=error_msg,
                error="INTERNAL_ERROR"
            )
    
    def _extract_json_from_output(self, output_str: str) -> Dict[str, str]:
        """Extrait le JSON de la sortie de l'agent"""
        try:
            output_str = output_str.strip()
            first_brace = output_str.find("{")
            last_brace = output_str.rfind("}")
            if first_brace == -1 or last_brace == -1:
                raise ValueError("Aucun JSON détecté dans la sortie de modification")
            json_str = output_str[first_brace:last_brace+1]
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"Erreur de parsing JSON : {e}")
            raise ValueError(f"JSON invalide retourné par l'agent : {e}")
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction JSON : {e}")
            raise ValueError(f"Erreur d'extraction JSON : {e}")
    
    def _generate_friendly_response(self, user_message: str, modified_project: Dict[str, str]) -> str:
        """Génère une réponse amicale pour l'utilisateur"""
        # Analyser le type de modification demandée
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ["couleur", "color", "bleu", "rouge", "vert", "theme"]):
            return "✨ Parfait ! J'ai mis à jour les couleurs de votre application. Vous pouvez voir les changements dans l'aperçu !"
        elif any(word in message_lower for word in ["logo", "icone", "icon", "image"]):
            return "🎨 Super ! J'ai ajouté/modifié le logo de votre application. Jetez un coup d'œil !"
        elif any(word in message_lower for word in ["taille", "size", "grand", "petit", "spacing"]):
            return "📏 C'est fait ! J'ai ajusté les tailles et espacements selon votre demande."
        elif any(word in message_lower for word in ["texte", "text", "titre", "label"]):
            return "📝 Excellent ! Les textes ont été mis à jour. Vous pouvez voir les modifications dans l'aperçu."
        elif any(word in message_lower for word in ["fonction", "feature", "ajouter", "add"]):
            return "⚡ Génial ! J'ai ajouté la nouvelle fonctionnalité à votre application. Testez-la !"
        else:
            return "✅ Modification appliquée avec succès ! Vérifiez l'aperçu pour voir les changements."

# Instance globale du service
project_chat_service = ProjectChatService()