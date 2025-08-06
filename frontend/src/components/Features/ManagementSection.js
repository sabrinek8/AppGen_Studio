import { ManagementCard } from '../UI';
import { FolderOpen, Save, RotateCcw, Archive, MessageSquare, Trash2, Settings, Database } from 'lucide-react';
import { exportChatHistory } from '../../utils/chatUtils';

export const ManagementSection = ({
  onImport,
  onExport,
  onExportZip,
  onReset,
  onClearChatHistory,
  currentProject,
  currentProjectId
}) => {
  // Debug log to check if props are received
  console.log('ManagementSection props:', {
    onClearChatHistory: typeof onClearChatHistory,
    currentProjectId,
    hasCurrentProject: !!currentProject
  });
  
  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  const handleExportZip = () => {
    if (!currentProject || Object.keys(currentProject).length === 0) {
      alert('Aucun projet à exporter. Veuillez d\'abord générer ou importer un projet.');
      return;
    }
    onExportZip(currentProject);
  };

  const handleExportChatHistory = () => {
    if (!currentProjectId) {
      alert('Aucun projet actif pour exporter l\'historique de chat.');
      return;
    }
    
    const success = exportChatHistory(currentProjectId);
    if (success) {
      alert('Historique de chat exporté avec succès !');
    } else {
      alert('Aucun historique de chat trouvé pour ce projet.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '32px 20px'
    }}>
      {/* Header Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 48px auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '12px',
          letterSpacing: '-0.025em'
        }}>
          Gestion de Projet
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Gérez vos projets, exportez vos données et configurez votre environnement de travail
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: '32px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
      }}>
        
        {/* Project Management Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#3b82f6',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <Database size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              Gestion des Projets
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ManagementCard
              icon={<FolderOpen />}
              title="Importer un projet"
              subtitle="Chargez un projet existant depuis un fichier JSON"
              variant="info"
              action={() => {
                document.getElementById('import-input').click();
              }}
              actionLabel="Choisir un fichier"
            />

            <ManagementCard
              icon={<Save />}
              title="Exporter le projet (JSON)"
              subtitle="Sauvegardez votre projet au format JSON"
              variant="info"
              action={onExport}
              actionLabel="Télécharger JSON"
            />

            <ManagementCard
              icon={<Archive />}
              title="Exporter le projet (ZIP)"
              subtitle="Téléchargez votre projet avec la structure de dossiers"
              variant="info"
              action={handleExportZip}
              actionLabel="Télécharger ZIP"
            />
          </div>
        </div>

        {/* Chat History Management Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#10b981',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <MessageSquare size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              Historique des Conversations
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ManagementCard
              icon={<MessageSquare />}
              title="Exporter l'historique de chat"
              subtitle="Sauvegardez vos conversations avec l'IA"
              variant="success"
              action={handleExportChatHistory}
              actionLabel="Exporter l'historique"
            />

            <ManagementCard
              icon={<Trash2 />}
              title="Effacer l'historique de chat"
              subtitle={currentProjectId 
                ? "Supprimer les conversations pour ce projet" 
                : "Générez d'abord un projet pour activer cette option"
              }
              variant="warning"
              action={currentProjectId && onClearChatHistory ? onClearChatHistory : null}
              actionLabel={currentProjectId ? "Effacer l'historique" : "Aucun projet actif"}
            />

            {currentProjectId && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                fontSize: '14px',
                color: '#166534',
                marginTop: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <div>
                    <strong>Projet actuel :</strong> {currentProjectId.slice(0, 8)}...
                    <br />
                    <span style={{ fontSize: '13px', color: '#15803d' }}>
                      L'historique est automatiquement sauvegardé localement.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Management Section - Full Width */}
      <div style={{
        maxWidth: '1200px',
        margin: '32px auto 0 auto'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#ef4444',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <Settings size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              Configuration Système
            </h2>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '400px' }}>
              <ManagementCard
                icon={<RotateCcw />}
                title="Réinitialiser tout"
                subtitle="Revenir au projet par défaut et effacer toutes les données"
                variant="danger"
                action={onReset}
                actionLabel="Réinitialiser"
              />
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#dc2626',
              fontSize: '14px',
              margin: 0,
              fontWeight: '500'
            }}>
              ⚠️ Attention : Cette action est irréversible et supprimera toutes vos données
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        onChange={handleImportFile}
        style={{ display: 'none' }}
        id="import-input"
      />
    </div>
  );
};