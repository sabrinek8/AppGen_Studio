from crewai import Agent, Task
from app.core.ClaudeLLM import ClaudeLLM

llm_claude = ClaudeLLM()

frontend_generator_agent = Agent(
    role="React Frontend Architect",
    goal="Créer une application ReactJS moderne avec des composants réutilisables",
    backstory="Expert ReactJS, spécialisé dans la génération automatisée d'UI modernes.",
    verbose=False,
    allow_delegation=False,
    llm=llm_claude
)

def create_react_task(description: str, features: str = "") -> Task:
    task_description = f"""Génère une application ReactJS en utilisant une structure complète de fichiers.

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
        expected_output="Un JSON contenant les fichiers du projet ReactJS (clé = chemin, valeur = code).",
        agent=frontend_generator_agent
    )
