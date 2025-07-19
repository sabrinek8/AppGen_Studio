import React from 'react';
import { ManagementCard } from '../UI';
import { FolderOpen } from 'lucide-react';
import { Save } from 'lucide-react';
import { RotateCcw } from 'lucide-react';



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
    gridTemplateColumns: '1fr'
    }}>
      <ManagementCard
        icon= <FolderOpen />
        title="Importer un projet"
        subtitle="Chargez un projet existant depuis un fichier JSON"
        variant="info"
        action={() => {
          document.getElementById('import-input').click();
        }}
        actionLabel="Choisir un fichier"
      />

      <ManagementCard
        icon=<Save />
        title="Exporter le projet"
        subtitle="Sauvegardez votre projet au format JSON"
        variant="success"
        action={onExport}
        actionLabel="Télécharger JSON"
      />

      <ManagementCard
        icon=<RotateCcw />
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
