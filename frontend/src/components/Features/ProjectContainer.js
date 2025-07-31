import React from 'react';
import { useProject, useProjectGenerator, useNavigation, useFileHandler, useProjectChat } from '../../hooks';
import { useFileUpload } from '../../hooks/useFileUpload';
import { exportProjectAsZip, exportProjectAsZipSimple } from '../../utils/zipExport';
import { clearAllChatData, clearProjectChatHistory } from '../../utils/chatUtils';
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

  const {
    currentProjectId,
    storeProject,
    resetProject: resetChatProject
  } = useProjectChat();

  const handleGenerate = async () => {
    try {
      const filesContext = getFilesContext();
      const projectData = await generateProject(filesContext);
      
      // Extract files from the response structure
      const files = projectData.files || projectData;
      const projectId = projectData.project_id;
      
      // Import the project files for preview
      importProject(files);
      
      // Store project for chat functionality
      if (projectId) {
        await storeProject(projectData);
      }
      
      navigateTo('preview');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert(`Erreur lors de la génération : ${error.message}`);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    // Update the current project when modified via chat
    importProject(updatedProject);
  };

  const handleImport = async (file) => {
    try {
      const projectData = await importFromFile(file);
      importProject(projectData);
      
      // Store imported project for chat
      try {
        await storeProject(projectData);
      } catch (error) {
        console.warn('Impossible de stocker le projet importé pour le chat:', error);
      }
      
      navigateTo('preview');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExportZip = async (projectData) => {
    try {
      if (!projectData || Object.keys(projectData).length === 0) {
        alert('Aucun projet à exporter. Veuillez d\'abord générer ou importer un projet.');
        return;
      }
      
      console.log('Données du projet à exporter:', projectData);
      console.log('Nombre de fichiers:', Object.keys(projectData).length);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
      const projectName = `react-project-${timestamp}`;
      
      try {
        await exportProjectAsZip(projectData, projectName);
        alert('Files téléchargés avec succès ! 🎉');
      } catch (zipError) {
        console.log('Erreur ZIP, utilisation du fallback:', zipError.message);
        exportProjectAsZipSimple(projectData, projectName);
        alert('Tous les fichiers ont été téléchargés individuellement.');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export du projet: ' + error.message);
    }
  };

  const handleReset = () => {
    const success = resetProject();
    if (success) {
      resetForm();
      clearAllFiles();
      resetChatProject();
      clearAllChatData(); // Clear all chat data from localStorage
      navigateTo('generator');
    }
  };

 const handleClearChatHistory = () => {
    if (!currentProjectId) {
      alert("Aucun projet actif pour effacer l'historique de chat.");
      return;
    }
    
    if (window.confirm("Êtes-vous sûr de vouloir effacer l'historique de chat pour ce projet ?")) {
      try {
        clearProjectChatHistory(currentProjectId);
        alert("Historique de chat effacé avec succès !");
        // Force reload of the page to refresh the chat interface
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de l\'effacement:', error);
        alert("Erreur lors de l'effacement de l'historique.");
      }
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
            projectId={currentProjectId}
            onProjectUpdate={handleProjectUpdate}
          />
        );
      case 'manage':
        return (
          <ManagementSection
            onImport={handleImport}
            onExport={exportProject}
            onExportZip={handleExportZip}
            onReset={handleReset}
            onClearChatHistory={handleClearChatHistory}
            currentProject={currentProject}
            currentProjectId={currentProjectId}
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