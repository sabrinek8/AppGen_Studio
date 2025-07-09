import React, { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { githubLight } from "@codesandbox/sandpack-themes";

const ReactCodePreview = () => {
  // Default project structure
  const defaultProject = {
    "/App.js": `import React, { useState } from 'react';
import Button from './components/Button';
import Counter from './components/Counter';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="app">
      <h1>Mon Application React</h1>
      <Counter count={count} />
      <Button onClick={() => setCount(count + 1)} text="Incrémenter" />
      <Button onClick={() => setCount(count - 1)} text="Décrémenter" />
      <Button onClick={() => setCount(0)} text="Reset" />
    </div>
  );
}`,
    "/components/Button.js": `import React from 'react';

export default function Button({ onClick, text, disabled = false }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: disabled ? '#ccc' : '#4ecdc4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {text}
    </button>
  );
}`,
    "/components/Counter.js": `import React from 'react';

export default function Counter({ count }) {
  return (
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '20px 0',
      padding: '20px',
      border: '2px solid #4ecdc4',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      Compteur: {count}
    </div>
  );
}`,
    "/App.css": `.app {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}`
  };

  const [currentProject, setCurrentProject] = useState(defaultProject);
  const [selectedFile, setSelectedFile] = useState("/App.js");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");

  // API Configuration
  const API_BASE_URL = "http://localhost:8000";

  // Generate project via API
  const handleGenerateProject = async () => {
    if (!projectDescription.trim()) {
      alert("Veuillez entrer une description du projet.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: projectDescription,
          features: projectFeatures
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.project_data) {
        setCurrentProject(data.project_data);
        const firstFile = Object.keys(data.project_data)[0];
        setSelectedFile(firstFile);
        alert("Projet généré avec succès !");
      } else {
        alert(`Erreur lors de la génération : ${data.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert(`Erreur de connexion à l'API : ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Import project from JSON
  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target.result);
          setCurrentProject(projectData);
          const firstFile = Object.keys(projectData)[0];
          setSelectedFile(firstFile);
        } catch (error) {
          alert("Erreur lors de l'importation du projet. Vérifiez le format JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Export project to JSON
  const handleExportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'react-project.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Reset to default project
  const handleResetProject = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le projet ?")) {
      setCurrentProject(defaultProject);
      setSelectedFile("/App.js");
      setProjectDescription("");
      setProjectFeatures("");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Générateur de Projet React avec IA
      </h1>

      {/* AI Project Generator */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        border: '2px solid #4ecdc4'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>🤖 Générer un projet avec l'IA</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description du projet :
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Ex: Une application de gestion de recettes avec création, consultation et gestion d'utilisateurs..."
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Fonctionnalités spécifiques (optionnel) :
          </label>
          <textarea
            value={projectFeatures}
            onChange={(e) => setProjectFeatures(e.target.value)}
            placeholder="Ex: - Page d'accueil avec liste des recettes
- Page de profil utilisateur
- Formulaire de création avec upload d'image..."
            style={{
              width: '100%',
              height: '100px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          onClick={handleGenerateProject}
          disabled={isGenerating}
          style={{
            padding: '12px 24px',
            backgroundColor: isGenerating ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isGenerating ? '🔄 Génération en cours...' : '✨ Générer avec l\'IA'}
        </button>
      </div>

      {/* Project Controls */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
      }}>
        
        <input
          type="file"
          accept=".json"
          onChange={handleImportProject}
          style={{ display: 'none' }}
          id="import-input"
        />
        <label
          htmlFor="import-input"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📁 Importer Projet
        </label>
        
        <button
          onClick={handleExportProject}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          💾 Exporter Projet
        </button>
        
        <button
          onClick={handleResetProject}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Sandpack Preview */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Sandpack
          template="react"
          theme={githubLight}
          files={currentProject}
          options={{
            showNavigator: true,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: 400,
            activeFile: selectedFile,
            readOnly: false
          }}
          customSetup={{
            dependencies: {
              react: "^18.0.0",
              "react-dom": "^18.0.0",
              "react-router-dom": "^6.22.0"
            }
          }}
        />
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>Instructions :</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>🤖 Utilisez l'IA pour générer un projet React complet basé sur votre description</li>
          <li>📁 Importez un projet JSON existant pour continuer à travailler</li>
          <li>💾 Exportez votre projet en JSON pour le sauvegarder</li>
          <li>🔄 Réinitialisez pour revenir au projet par défaut</li>
          <li>⚠️ Assurez-vous que le backend FastAPI est en cours d'exécution sur localhost:8000</li>
        </ul>
      </div>
    </div>
  );
};

export default ReactCodePreview;