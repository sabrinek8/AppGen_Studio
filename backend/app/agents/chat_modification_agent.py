from crewai import Agent, Task
from app.core.ClaudeLLM import ClaudeLLM
from typing import Dict, Any

llm_claude = ClaudeLLM()

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

PROJET ACTUEL COMPLET :
{project_context}

RÈGLES DE MODIFICATION CRITIQUES :
➤ RETOURNE TOUJOURS LE PROJET COMPLET avec TOUS les fichiers
➤ Applique UNIQUEMENT les modifications demandées par l'utilisateur
➤ Conserve EXACTEMENT tous les autres fichiers sans modification
➤ Pour les couleurs/thèmes : Modifie les StyleSheet appropriés
➤ Pour les logos/images : Utilise des émojis ou caractères Unicode si pas d'URL fournie
➤ Pour les fonctionnalités : Ajoute le code nécessaire sans casser l'existant
➤ Garde la compatibilité React Native Web
➤ Respecte les mêmes contraintes : pas de packages externes

STRUCTURE DE SORTIE OBLIGATOIRE :
➤ Format JSON contenant TOUS les fichiers du projet (modifiés ET non-modifiés)
➤ Clé = chemin du fichier, Valeur = code complet du fichier
➤ Inclus tous les fichiers existants même s'ils ne sont pas modifiés

EXEMPLE de structure attendue :
{{
  "/App.js": "code complet du fichier App.js",
  "/components/Button.js": "code complet du fichier Button.js", 
  "/components/Counter.js": "code complet du fichier Counter.js",
  ... (tous les autres fichiers)
}}

IMPORTANT : Ne retourne PAS seulement les fichiers modifiés, mais le projet ENTIER avec les modifications appliquées."""
    
    return Task(
        description=task_description,
        expected_output="Un JSON contenant TOUS les fichiers React Native Web du projet complet avec les modifications demandées appliquées.",
        agent=chat_modification_agent
    )