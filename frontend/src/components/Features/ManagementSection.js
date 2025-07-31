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
    <div style={{
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Project Management */}
      <div>
        <h3 style={{
          marginBottom: '20px',
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📁 Gestion des Projets
        </h3>
        
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
        <h3 style={{
          marginBottom: '20px',
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          💬 Historique des Conversations
        </h3>
        
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
        <h3 style={{
          marginBottom: '20px',
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          🔄 Système
        </h3>
        
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
  );
};