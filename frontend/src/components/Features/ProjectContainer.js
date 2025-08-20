import React from 'react';
import { useProject, useProjectGenerator, useNavigation, useFileHandler, useProjectChat } from '../../hooks';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useAlerts } from '../../hooks/useAlerts';
import { useTranslation } from '../../contexts/TranslationContext';
import { exportProjectAsZip, exportProjectAsZipSimple } from '../../utils/zipExport';
import { clearAllChatData, clearProjectChatHistory } from '../../utils/chatUtils';
import { GeneratorSection } from './GeneratorSection';
import { PreviewSection } from './PreviewSection';
import { ManagementSection } from './ManagementSection';
import { AlertContainer } from '../UI/AlertContainer';

export const ProjectContainer = () => {
  const { t } = useTranslation();
  
  const { 
    alerts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert
  } = useAlerts();
  
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
      showSuccess(t('projectGenerated'));
    } catch (error) {
      console.error(t('generationErrorConsole'), error);
      showError(`${t('generationError')} ${error.message}`);
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
        console.warn(t('unableToStoreProject'), error);
        showWarning(t('projectImportedChatWarning'));
      }
      
      navigateTo('preview');
      showSuccess(t('projectImported'));
    } catch (error) {
      showError(error.message);
    }
  };

  const handleExportZip = async (projectData) => {
    try {
      if (!projectData || Object.keys(projectData).length === 0) {
        showWarning(t('noProjectToExport'));
        return;
      }
      
      console.log(t('exportDataConsole'), projectData);
      console.log(t('fileCountConsole'), Object.keys(projectData).length);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
      const projectName = `react-project-${timestamp}`;
      
      try {
        await exportProjectAsZip(projectData, projectName);
        showSuccess(t('filesDownloaded'));
      } catch (zipError) {
        console.log(t('zipFallbackMessage'), zipError.message);
        exportProjectAsZipSimple(projectData, projectName);
        showInfo(t('filesDownloadedIndividually'));
      }
      
    } catch (error) {
      console.error(t('exportErrorConsole'), error);
      showError(t('exportError') + error.message);
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
      showInfo(t('projectReset'));
    } else {
      showError(t('resetError'));
    }
  };

  const handleClearChatHistory = () => {
    if (!currentProjectId) {
      showWarning(t('noActiveProjectChat'));
      return;
    }
    
    // Create a confirmation modal instead of using window.confirm
    const confirmClear = () => {
      try {
        clearProjectChatHistory(currentProjectId);
        showSuccess(t('chatHistoryCleared'));
        // Force reload of the page to refresh the chat interface
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error(t('clearErrorConsole'), error);
        showError(t('clearHistoryError'));
      }
    };

    // You might want to implement a proper modal here instead
    if (window.confirm(t('clearChatConfirmation'))) {
      confirmClear();
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
    renderActiveSection: () => (
      <>
        {/* Alert Container */}
        <AlertContainer 
          alerts={alerts}
          onRemove={removeAlert}
          position="top-right"
        />
        
        {/* Main Content */}
        <div className="project-container">
          {renderActiveSection()}
        </div>
      </>
    )
  };
};