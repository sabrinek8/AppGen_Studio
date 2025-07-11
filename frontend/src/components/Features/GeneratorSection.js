import React from 'react';
import { Card, SectionHeader, Button, Textarea } from '../UI';
import { FileUpload } from '../UI/FileUpload';

export const GeneratorSection = ({
  projectDescription,
  setProjectDescription,
  projectFeatures,
  setProjectFeatures,
  isGenerating,
  onGenerate,
  selectedFiles,
  onFileSelect,
  onFileRemove
}) => (
  <Card>
    <SectionHeader
      icon="🤖"
      title="Générateur IA"
      subtitle="Créez votre projet React personnalisé avec l'intelligence artificielle"
    />

    <div style={{
      display: 'grid',
      gap: '24px',
      marginBottom: '30px'
    }}>
      <Textarea
        label="💡 Description du projet"
        icon="💡"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        placeholder="Décrivez votre application React idéale... Ex: Une application de gestion de tâches avec authentification, création de projets, et tableau de bord analytique."
        rows={5}
      />

      <Textarea
        label="⚡ Fonctionnalités spécifiques (optionnel)"
        icon="⚡"
        value={projectFeatures}
        onChange={(e) => setProjectFeatures(e.target.value)}
        placeholder={`Listez les fonctionnalités spécifiques souhaitées...
• Interface utilisateur moderne avec dark mode
• Gestion d'état avec contexte React
• Animations fluides et responsive design
• Intégration API REST`}
        rows={6}
      />

      <FileUpload
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
        selectedFiles={selectedFiles}
      />

      {selectedFiles.length > 0 && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid #c3e6c3',
          fontSize: '14px',
          color: '#2d5a2d'
        }}>
          <strong>💡 Astuce :</strong> Les fichiers uploadés seront analysés par l'IA pour mieux comprendre votre style de code et vos préférences architecturales.
        </div>
      )}
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !projectDescription.trim()}
        size="large"
      >
        {isGenerating ? (
          <>
            <span>🔄</span>
            Génération...
          </>
        ) : (
          <>
            <span>✨</span>
            Générer le projet
          </>
        )}
      </Button>
    </div>
  </Card>
);