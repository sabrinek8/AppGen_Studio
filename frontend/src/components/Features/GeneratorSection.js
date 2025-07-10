import React from 'react';
import { Card, SectionHeader, Button, Textarea } from '../UI';

export const GeneratorSection = ({
  projectDescription,
  setProjectDescription,
  projectFeatures,
  setProjectFeatures,
  isGenerating,
  onGenerate
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
