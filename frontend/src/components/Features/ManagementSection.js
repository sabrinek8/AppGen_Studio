import React from 'react';
import { ManagementCard } from '../UI';

export const ManagementSection = ({
  onImport,
  onExport,
  onReset
}) => {
  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    }}>
      <ManagementCard
        icon="📁"
        title="Importer un projet"
        subtitle="Chargez un projet existant depuis un fichier JSON"
        variant="info"
        action={() => {
          document.getElementById('import-input').click();
        }}
        actionLabel="Choisir un fichier"
      />

      <ManagementCard
        icon="💾"
        title="Exporter le projet"
        subtitle="Sauvegardez votre projet au format JSON"
        variant="success"
        action={onExport}
        actionLabel="Télécharger JSON"
      />

      <ManagementCard
        icon="🔄"
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
