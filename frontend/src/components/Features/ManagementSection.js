import { ManagementCard } from '../UI';
import { FolderOpen, Save, RotateCcw, Archive, MessageSquare, Trash2 } from 'lucide-react';
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
    <>
      {/* Titre bar principal */}
      <div className="bg-supporting-blue title-bar" data-bs-theme="light">
        <div className="container-xxl">
          <h1 className="display-1">Gestion de Projet</h1>
          <picture>
            <source media="(min-width:1440px)" srcSet="https://boosted.orange.com/docs/5.3/assets/img/title-bars-illustrations/illustration-1440.png" />
            <source media="(min-width:1280px)" srcSet="https://boosted.orange.com/docs/5.3/assets/img/title-bars-illustrations/illustration-1280.png" />
            <source media="(min-width:1024px)" srcSet="/docs/5.3/assets/img/title-bars-illustrations/illustration-1024.png" />
            <source media="(min-width:768px)" srcSet="/docs/5.3/assets/img/title-bars-illustrations/illustration-768.png" />
            <source media="(min-width:480px)" srcSet="/docs/5.3/assets/img/title-bars-illustrations/illustration-480.png" />
            <source media="(min-width:320px)" srcSet="https://boosted.orange.com/docs/5.3/assets/img/title-bars-illustrations/illustration-320.png" />
            <img src="https://boosted.orange.com/docs/5.3/assets/img/title-bars-illustrations/illustration-320.png" alt="" />
          </picture>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
      
        {/* Project Management */}
        <div>
          <div className="title-bar">
            <div className="container-xxl">
              <h1 className="display-4">Outils de Projet</h1>
            </div>
          </div>

          <div className="mt-3"></div>

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
              variant="success"
              action={onExport}
              actionLabel="Télécharger JSON"
            />

            <ManagementCard
              icon={<Archive />}
              title="Exporter le projet (ZIP)"
              subtitle="Téléchargez votre projet avec la structure de dossiers"
              variant="primary"
              action={handleExportZip}
              actionLabel="Télécharger ZIP"
            />
          </div>
        </div>

        {/* Chat History Management */}
        <div>
          <div className="title-bar">
            <div className="container-xxl">
              <h1 className="display-4">Historique des Conversations</h1>
            </div>
          </div>

          <div className="mt-3"></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ManagementCard
              icon={<MessageSquare />}
              title="Exporter l'historique de chat"
              subtitle="Sauvegardez vos conversations avec l'IA"
              variant="info"
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
              variant="secondary"
              action={currentProjectId && onClearChatHistory ? onClearChatHistory : null}
              actionLabel={currentProjectId ? "Effacer l'historique" : "Aucun projet actif"}
            />

            {currentProjectId && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#e8f5e8',
                borderRadius: '8px',
                border: '1px solid #c3e6c3',
                fontSize: '13px',
                color: '#2d5a2d'
              }}>
                <strong>💡 Info :</strong> Projet actuel: {currentProjectId.slice(0, 8)}...
                <br />
                L'historique est automatiquement sauvegardé localement.
              </div>
            )}
          </div>
        </div>

        {/* System Management */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="title-bar">
            <div className="container-xxl">
              <h1 className="display-4">Système</h1>
            </div>
          </div>

          <div className="mt-3"></div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '20px'
          }}>
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

        <input
          type="file"
          accept=".json"
          onChange={handleImportFile}
          style={{ display: 'none' }}
          id="import-input"
        />
      </div>
    </>
  );
};