import React from 'react';
import { useProject, useProjectGenerator, useNavigation, useFileHandler } from '../../hooks';
import { GeneratorSection } from './GeneratorSection';
import { PreviewSection } from './PreviewSection';
import { ManagementSection } from './ManagementSection';

export const ProjectContainer = () => {
  const { 
    currentProject, 
    selectedFile, 
    resetProject, 
    importProject, 
    exportProject 
  } = useProject();
  
  const {
    projectDescription,
    setProjectDescription,
    projectFeatures,
    setProjectFeatures,
    isGenerating,
    generateProject,
    resetForm
  } = useProjectGenerator();

  const { activeSection, navigateTo } = useNavigation();
  const { importFromFile } = useFileHandler();

  const handleGenerate = async () => {
    try {
      const projectData = await generateProject();
      importProject(projectData);
      navigateTo('preview');
      alert("Projet généré avec succès !");
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert(`Erreur lors de la génération : ${error.message}`);
    }
  };

  const handleImport = async (file) => {
    try {
      const projectData = await importFromFile(file);
      importProject(projectData);
      navigateTo('preview');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReset = () => {
    const success = resetProject();
    if (success) {
      resetForm();
      navigateTo('generator');
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'generator':
        return (
          <GeneratorSection
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
            projectFeatures={projectFeatures}
            setProjectFeatures={setProjectFeatures}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        );
      case 'preview':
        return (
          <PreviewSection
            currentProject={currentProject}
            selectedFile={selectedFile}
          />
        );
      case 'manage':
        return (
          <ManagementSection
            onImport={handleImport}
            onExport={exportProject}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return {
    activeSection,
    navigateTo,
    renderActiveSection
  };
};