import React from 'react';
import { ManagementCard } from '../UI';
import { FolderOpen, Save, RotateCcw, Archive } from 'lucide-react';

export const ManagementSection = ({
  onImport,
  onExport,
  onExportZip,
  onReset,
  currentProject
}) => {
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

  return (
    <div style={{
     display: 'grid',
    gap: '24px',
    gridTemplateColumns: '1fr'
    }}>
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

      <ManagementCard
        icon={<RotateCcw />}
        title="Réinitialiser"
        subtitle="Revenir au projet par défaut"
        variant="danger"
        action={onReset}
        actionLabel="Réinitialiser"
      />

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