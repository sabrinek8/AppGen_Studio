from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import json
import logging
from crewai import Agent, Task, Crew
from core.ClaudeLLM import ClaudeLLM

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="React Project Generator API", version="1.0.0")

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de votre frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles Pydantic pour la validation des données
class ProjectRequest(BaseModel):
    description: str
    features: str = ""
    
class ProjectResponse(BaseModel):
    success: bool
    project_data: Dict[str, Any] = None
    error: str = None

# Initialisation du LLM et de l'agent
llm_claude = ClaudeLLM()

html_generator_agent = Agent(
    role="React Frontend Architect",
    goal="Créer une application ReactJS moderne avec des composants réutilisables",
    backstory="Expert ReactJS, spécialisé dans la génération automatisée d'UI modernes.",
    verbose=True,
    allow_delegation=False,
    llm=llm_claude
)

def create_react_task(description: str, features: str = "") -> Task:
    """Crée une tâche de génération React personnalisée"""
    task_description = f"""Génère une application ReactJS en utilisant une structure complète de fichiers.

Fonctionnalité de l'application : {description}

{features}

➤ Chaque composant ou page doit être dans un fichier séparé avec une exportation sous la forme :
`export default function NomDuComposant() {{ ... }}`
Ne génère **aucun fichier index.js ou index.html**.

➤ Structure la réponse sous forme d'un objet JSON valide :
- Chaque **clé** représente le chemin du fichier (ex. `/App.js`, `/components/..`)
- Chaque **valeur** contient le contenu complet du fichier (code JavaScript ou CSS)

Réponds uniquement avec du JSON brut et valide. Ne précède ni ne suis ta réponse d'aucun texte, commentaire ou explication.
Commence directement par `{{` et termine par `}}`.
"""
    
    return Task(
        description=task_description,
        expected_output="Un JSON contenant les fichiers du projet ReactJS (clé = chemin, valeur = code).",
        agent=html_generator_agent
    )

def extract_json_from_output(output_str: str) -> Dict[str, Any]:
    """Extrait le JSON de la sortie du LLM"""
    try:
        # Nettoyage de la chaîne
        output_str = output_str.strip()
        
        # Recherche des accolades
        first_brace = output_str.find("{")
        last_brace = output_str.rfind("}")
        
        if first_brace == -1 or last_brace == -1:
            raise ValueError("Aucun JSON détecté dans la sortie")
        
        json_str = output_str[first_brace:last_brace+1]
        
        # Parsing du JSON
        project_data = json.loads(json_str)
        
        return project_data
    
    except json.JSONDecodeError as e:
        logger.error(f"Erreur de parsing JSON : {e}")
        raise ValueError(f"JSON invalide : {e}")
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction JSON : {e}")
        raise ValueError(f"Erreur d'extraction : {e}")

@app.get("/")
async def root():
    """Endpoint de santé"""
    return {"message": "React Project Generator API is running"}

@app.post("/generate-project", response_model=ProjectResponse)
async def generate_project(request: ProjectRequest):
    """Génère un projet React via l'agent CrewAI"""
    try:
        logger.info(f"Génération d'un projet React pour : {request.description}")
        
        # Création de la tâche
        task = create_react_task(request.description, request.features)
        
        # Création et exécution de l'équipe
        crew = Crew(
            agents=[html_generator_agent],
            tasks=[task],
            verbose=True
        )
        
        # Exécution de la tâche
        result = crew.kickoff()
        
        # Extraction du texte résultat
        result_str = str(result.output).strip() if hasattr(result, "output") else str(result).strip()
        
        # Extraction du JSON
        project_data = extract_json_from_output(result_str)
        
        logger.info("Projet React généré avec succès")
        
        return ProjectResponse(
            success=True,
            project_data=project_data
        )
        
    except ValueError as e:
        logger.error(f"Erreur de validation : {e}")
        return ProjectResponse(
            success=False,
            error=str(e)
        )
    except Exception as e:
        logger.error(f"Erreur inattendue : {e}")
        return ProjectResponse(
            success=False,
            error=f"Erreur interne : {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Vérification de santé du service"""
    return {"status": "healthy", "service": "React Project Generator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)