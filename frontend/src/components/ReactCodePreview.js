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
  const [activeSection, setActiveSection] = useState('generator');

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
        setActiveSection('preview');
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
          setActiveSection('preview');
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
      setActiveSection('generator');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            color: 'white',
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚀 React AI Generator
          </h1>
          
          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '10px' }}>
            {['generator', 'preview', 'manage'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  padding: '10px 20px',
                  background: activeSection === section 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {section === 'generator' && '🤖 Générateur'}
                {section === 'preview' && '👁️ Aperçu'}
                {section === 'manage' && '⚙️ Gestion'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Generator Section */}
        {activeSection === 'generator' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                fontSize: '24px'
              }}>
                🤖
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#2c3e50'
                }}>
                  Générateur IA
                </h2>
                <p style={{
                  margin: '5px 0 0 0',
                  color: '#7f8c8d',
                  fontSize: '16px'
                }}>
                  Créez votre projet React personnalisé avec l'intelligence artificielle
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gap: '24px',
              marginBottom: '30px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '16px'
                }}>
                  💡 Description du projet
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Décrivez votre application React idéale... Ex: Une application de gestion de tâches avec authentification, création de projets, et tableau de bord analytique."
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '16px'
                }}>
                  ⚡ Fonctionnalités spécifiques (optionnel)
                </label>
                <textarea
                  value={projectFeatures}
                  onChange={(e) => setProjectFeatures(e.target.value)}
                  placeholder="Listez les fonctionnalités spécifiques souhaitées...
• Interface utilisateur moderne avec dark mode
• Gestion d'état avec contexte React
• Animations fluides et responsive design
• Intégration API REST"
                  style={{
                    width: '100%',
                    height: '140px',
                    padding: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleGenerateProject}
                disabled={isGenerating || !projectDescription.trim()}
                style={{
                  padding: '16px 40px',
                  background: isGenerating || !projectDescription.trim()
                    ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isGenerating || !projectDescription.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  minWidth: '200px'
                }}
              >
                {isGenerating ? (
                  <>
                    <span style={{ marginRight: '10px' }}>🔄</span>
                    Génération...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '10px' }}>✨</span>
                    Générer le projet
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {activeSection === 'preview' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                fontSize: '20px'
              }}>
                👁️
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#2c3e50'
                }}>
                  Aperçu du projet
                </h2>
                <p style={{
                  margin: '2px 0 0 0',
                  color: '#7f8c8d',
                  fontSize: '14px'
                }}>
                  Éditez et testez votre code en temps réel
                </p>
              </div>
            </div>

            <div style={{
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
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
                  editorHeight: 500,
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
          </div>
        )}

        {/* Management Section */}
        {activeSection === 'manage' && (
          <div style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {/* Import Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '20px'
                }}>
                  📁
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Importer un projet
                  </h3>
                  <p style={{
                    margin: '4px 0 0 0',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    Chargez un projet existant depuis un fichier JSON
                  </p>
                </div>
              </div>
              
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
                  display: 'block',
                  width: '100%',
                  padding: '12px 0',
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                Choisir un fichier
              </label>
            </div>

            {/* Export Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '20px'
                }}>
                  💾
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Exporter le projet
                  </h3>
                  <p style={{
                    margin: '4px 0 0 0',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    Sauvegardez votre projet au format JSON
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleExportProject}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                Télécharger JSON
              </button>
            </div>

            {/* Reset Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '20px'
                }}>
                  🔄
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2c3e50'
                  }}>
                    Réinitialiser
                  </h3>
                  <p style={{
                    margin: '4px 0 0 0',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    Revenir au projet par défaut
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleResetProject}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '30px 0',
        marginTop: '50px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{
              margin: '0 0 12px 0',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              📝 Guide d'utilisation
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <div>🤖 Utilisez l'IA pour générer des projets personnalisés</div>
              <div>👁️ Visualisez et éditez votre code en temps réel</div>
              <div>⚙️ Gérez vos projets avec import/export</div>
            </div>
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default ReactCodePreview;