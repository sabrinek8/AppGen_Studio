import { useState } from 'react';

export const useProject = () => {
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

  const resetProject = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le projet ?")) {
      setCurrentProject(defaultProject);
      setSelectedFile("/App.js");
      return true;
    }
    return false;
  };

  const importProject = (projectData) => {
    setCurrentProject(projectData);
    const firstFile = Object.keys(projectData)[0];
    setSelectedFile(firstFile);
  };

  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'react-project.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    currentProject,
    selectedFile,
    setSelectedFile,
    resetProject,
    importProject,
    exportProject
  };
};