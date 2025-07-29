import React from 'react';
import { useProject, useProjectGenerator, useNavigation, useFileHandler } from '../../hooks';
import { useFileUpload } from '../../hooks/useFileUpload';
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
  
  const {
    selectedFiles,
    addFile,
    removeFile,
    clearAllFiles,
    getFilesContext
  } = useFileUpload();

  const handleGenerate = async () => {
    try {
      const filesContext = getFilesContext();
      const projectData = await generateProject(filesContext);
      importProject(projectData);
      navigateTo('preview');
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
      clearAllFiles();
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
            selectedFiles={selectedFiles}
            onFileSelect={addFile}
            onFileRemove={removeFile}
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