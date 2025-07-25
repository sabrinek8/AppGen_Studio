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

<<<<<<< HEAD
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
=======
RÈGLES CRITIQUES REACT NATIVE WEB :
➤ IMPORTS depuis react-native-web : `import {{ View, Text, TouchableOpacity, StyleSheet }} from 'react-native-web'`
et React et useState depuis react
➤ Composants react-native-web :
  - <div> → <View>
  - <span>, <p>, <h1-h6> → <Text>
  - <button> → <TouchableOpacity> avec onPress
  - <img> → <Image source={{{{ uri: 'url' }}}}>
➤ StyleSheet.create() pour les styles
➤ GARDER la logique web : window.confirm(), window.alert(), document, localStorage, etc.
➤ Structure : App.js à la racine, composants séparés
➤ URIs d'images valides avec Image component
➤ Échapper les apostrophes : \' dans les strings
➤ Ne génère pas index.html !
➤ Utilise ce index.js :
import React from 'react';
import {{ createRoot }} from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);'
➤ Utilisez une toggle sidebar au lieu du menu header, sans importer de dépendances externes.
CONTRAINTES PACKAGES EXTERNES :
➤ INTERDIT : N'utilise ou n'importe AUCUN package externe React Native (react-navigation, @react-native-community, react-native-vector-icons, etc.)
➤ OBLIGATOIRE : Si une fonctionnalité nécessite un package externe, code-la manuellement :
  - Navigation : Utilise useState pour gérer les écrans/routes
  - Icônes : Crée des composants SVG ou utilise des caractères Unicode/émojis
  - Animations : Utilise les Animated API de React Native ou CSS transitions
  - Composants UI : Code tous les composants personnalisés (modals, sliders, etc.)
➤ CRÉATIVITÉ : Développe des solutions créatives responsives et natives pour remplacer les packages
Format JSON uniquement : {{ "chemin/fichier.js": "code complet" }} """
    
>>>>>>> feat/react-native-web-migration
    return Task(
        description=task_description,
        expected_output="Un JSON contenant les fichiers React Native Web pour navigateur (clé = chemin, valeur = code).",
        agent=frontend_generator_agent
    )

