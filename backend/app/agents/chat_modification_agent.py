from crewai import Agent, Task
from app.core.ClaudeLLM import ClaudeLLM
from typing import Dict, Any
from app.core.AzureGithubLLM import AzureGitHubLLM

llm_claude = ClaudeLLM()
#llm_azure=AzureGitHubLLM()


chat_modification_agent = Agent(
    role="React Native Web Project Modifier",
    goal="Modifier le code React Native Web existant selon les demandes de l'utilisateur",
    backstory="Expert en modification de code React Native Web, spécialisé dans l'ajustement des styles, couleurs, thèmes, et fonctionnalités selon les demandes conversationnelles.",
    verbose=False,
    allow_delegation=False,
    llm=llm_claude
)

def create_modification_task(user_message: str, current_project: Dict[str, str]) -> Task:
    """
    Crée une tâche de modification basée sur le message utilisateur et le projet actuel
    
    Args:
        user_message: Message de l'utilisateur demandant une modification
        current_project: Dictionnaire contenant les fichiers du projet actuel
    """
    
    # Convertir le projet actuel en format lisible
    project_context = ""
    for file_path, file_content in current_project.items():
        project_context += f"\n--- {file_path} ---\n{file_content}\n"
    
    task_description = f"""Modifie le projet React Native Web existant selon cette demande utilisateur : "{user_message}"

PROJET ACTUEL :
{project_context}

RÈGLES DE MODIFICATION :
➤ Applique UNIQUEMENT les modifications demandées par l'utilisateur
➤ Conserve toute la structure et fonctionnalité existante non mentionnée
➤ Pour les couleurs/thèmes : Modifie les StyleSheet appropriés
➤ Pour les logos/images : Utilise des émojis ou caractères Unicode si pas d'URL fournie
➤ Pour les fonctionnalités : Ajoute le code nécessaire sans casser l'existant
➤ Garde la compatibilité React Native Web
➤ Respecte les mêmes contraintes : pas de packages externes

TYPES DE MODIFICATIONS SUPPORTÉES :
- Couleurs et thèmes (backgroundColor, color, etc.)
- Logos et icônes (émojis, Unicode, ou URLs d'images)
- Textes et labels
- Tailles et espacements
- Ajout de nouvelles fonctionnalités simples
- Réorganisation de l'interface

Format de sortie JSON uniquement : {{ "chemin/fichier.js": "code complet modifié" }}

Si la demande n'est pas claire ou impossible, retourne le projet original avec un commentaire explicatif."""
    
    return Task(
        description=task_description,
        expected_output="Un JSON contenant les fichiers React Native Web modifiés selon la demande utilisateur.",
        agent=chat_modification_agent
    )