from crewai import Agent, Task
from app.core.ClaudeLLM import ClaudeLLM
from app.core.AzureGithubLLM import AzureGitHubLLM

llm_claude = ClaudeLLM()
#llm_azure=AzureGitHubLLM()

frontend_generator_agent = Agent(
    role="React Native Web Frontend Architect",
    goal="Créer une application React Native Web moderne pour le navigateur web",
    backstory="Expert React Native Web (necolas/react-native-web), spécialisé dans la génération d'UI web utilisant l'API React Native.",
    verbose=False,
    allow_delegation=False,
    llm=llm_claude
)

def create_react_native_web_task(description: str, features: str = "") -> Task:
    task_description = f"""Génère une application React Native Web (https://necolas.github.io/react-native-web/) pour navigateur web.

Fonctionnalité de l'application : {description}

{features}

➤ Chaque composant ou page doit être dans un fichier séparé avec une exportation sous la forme :
`export default function NomDuComposant() {{ ... }}`
➤Ne génère **aucun fichier index.js ou index.html**.
➤Génère les fichiers App.js et App.css sont directement au dessous de root ne sont pas au dessous src/ !!!
➤Lorsque tu génères des objets ou des composants contenant des images (ex. image, photo, picture), essayer de définir des exemples dans js avec des liens valides.
➤Ajoute \' au lieu de ' dans les textes contenant des apostrophes, si la chaîne est entourée de guillemets simples.
➤ L'application doit etre responsive

➤ Structure la réponse sous forme d'un objet JSON valide :
- Chaque **clé** représente le chemin du fichier
- Chaque **valeur** contient le contenu complet du fichier

Réponds uniquement avec du JSON brut et valide.
"""
    return Task(
        description=task_description,
        expected_output="Un JSON contenant les fichiers React Native Web pour navigateur (clé = chemin, valeur = code).",
        agent=frontend_generator_agent
    )

