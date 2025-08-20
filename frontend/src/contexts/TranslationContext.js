import React, { createContext, useContext, useState, useEffect } from 'react';

// All translations for the application
const translations = {
  FR: {
    // Navigation
    generator: 'Générateur',
    preview: 'Aperçu',
    manage: 'Gestion',
    
    // Generator Section
    generatorTitle: 'Générateur IA',
    generatorSubtitle: 'Créez votre projet React personnalisé avec l\'intelligence artificielle',
    projectDescription: 'Description du projet',
    projectDescriptionPlaceholder: 'Décrivez votre application React idéale... Ex: Une application de gestion de tâches avec authentification, création de projets, et tableau de bord analytique.',
    specificFeatures: 'Fonctionnalités spécifiques (optionnel)',
    specificFeaturesPlaceholder: `Listez les fonctionnalités spécifiques souhaitées...
• Interface utilisateur moderne avec dark mode
• Gestion d'état avec contexte React
• Animations fluides et responsive design
• Intégration API REST`,
    referenceFiles: 'Fichiers de référence (optionnel)',
    generateProject: 'Générer le projet',
    generating: 'Génération...',
    fileUploadTip: 'Les fichiers uploadés seront analysés par l\'IA pour mieux comprendre votre style de code et vos préférences architecturales.',
    dragDropText: 'Glissez-déposez vos fichiers ici ou cliquez pour sélectionner',
    supportedFormats: 'Formats supportés : .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf (max 10MB)',
    filesSelected: 'Fichiers sélectionnés',
    
    // Preview Section
    previewTitle: 'Projet Interactif',
    previewSubtitle: 'Aperçu et modification en temps réel avec l\'assistant IA',
    codeEditor: 'Éditeur de Code',
    aiAssistant: 'Assistant IA',
    previewTip: 'Passez à l\'onglet "Assistant IA" pour modifier votre projet en parlant naturellement !',
    
    // Chat Interface
    chatTitle: 'Assistant IA',
    chatSubtitle: 'Discutez avec l\'IA pour modifier votre projet en temps réel',
    generateFirstProject: 'Générez d\'abord un projet',
    aiAvailableAfter: 'L\'assistant IA sera disponible après la génération de votre projet',
    greeting: '👋 Bonjour ! Je suis votre assistant IA.',
    chatDescription: 'Décrivez-moi les modifications que vous souhaitez apporter à votre projet :',
    quickSuggestions: '💡 Suggestions rapides :',
    chatPlaceholder: 'Décrivez la modification souhaitée... (Entrée pour envoyer)',
    orangeWorking: 'L\'assistant Orange travaille sur votre demande...',
    suggestions: [
      "Change la couleur de fond en bleu",
      "Ajoute un logo avec une icône 🚀",
      "Met un thème sombre",
      "Change la taille des boutons",
      "Ajoute une animation",
      "Modifie la typographie",
      "Ajoute des ombres et effets",
      "Change l'espacement des éléments"
    ],
    
    // Management Section
    managementTitle: 'Gestion de Projet',
    managementSubtitle: 'Gérez vos projets, exportez vos données et configurez votre environnement de travail',
    projectManagement: 'Gestion des Projets',
    conversationHistory: 'Historique des Conversations',
    systemConfiguration: 'Configuration Système',
    
    importProject: 'Importer un projet',
    importProjectDesc: 'Chargez un projet existant depuis un fichier JSON',
    chooseFile: 'Choisir un fichier',
    
    exportProjectJSON: 'Exporter le projet (JSON)',
    exportProjectJSONDesc: 'Sauvegardez votre projet au format JSON',
    downloadJSON: 'Télécharger JSON',
    
    exportProjectZIP: 'Exporter le projet (ZIP)',
    exportProjectZIPDesc: 'Téléchargez votre projet avec la structure de dossiers',
    downloadZIP: 'Télécharger ZIP',
    
    exportChatHistory: 'Exporter l\'historique de chat',
    exportChatHistoryDesc: 'Sauvegardez vos conversations avec l\'IA',
    exportHistory: 'Exporter l\'historique',
    
    clearChatHistory: 'Effacer l\'historique de chat',
    clearChatHistoryDesc: 'Supprimer les conversations pour ce projet',
    clearChatHistoryNoProject: 'Générez d\'abord un projet pour activer cette option',
    clearHistory: 'Effacer l\'historique',
    noActiveProject: 'Aucun projet actif',
    
    resetEverything: 'Réinitialiser tout',
    resetEverythingDesc: 'Revenir au projet par défaut et effacer toutes les données',
    reset: 'Réinitialiser',
    
    currentProject: 'Projet actuel :',
    autoSaved: 'L\'historique est automatiquement sauvegardé localement.',
    resetWarning: '⚠️ Attention : Cette action est irréversible et supprimera toutes vos données',
    
    // Success Messages
    projectGenerated: 'Projet généré avec succès !',
    projectImported: 'Projet importé avec succès !',
    projectExportedZIP: 'Projet exporté en ZIP avec succès.',
    filesDownloaded: 'Fichiers téléchargés avec succès ! 🎉',
    filesDownloadedIndividually: 'Tous les fichiers ont été téléchargés individuellement.',
    projectReset: 'Projet réinitialisé avec succès.',
    chatHistoryExported: 'Historique de chat exporté avec succès !',
    chatHistoryCleared: 'Historique de chat effacé avec succès !',
    
    // Error Messages
    generationError: 'Erreur lors de la génération :',
    projectDescriptionRequired: 'Veuillez entrer une description du projet.',
    noProjectToExport: 'Aucun projet à exporter. Veuillez d\'abord générer ou importer un projet.',
    projectImportError: 'Erreur lors de l\'importation du projet. Vérifiez le format JSON.',
    fileReadError: 'Erreur lors de la lecture du fichier.',
    exportError: 'Erreur lors de l\'export du projet: ',
    resetError: 'Erreur lors de la réinitialisation du projet.',
    connectionError: '❌ Erreur de connexion. Vérifiez que le serveur backend fonctionne.',
    errorOccurred: 'Une erreur est survenue',
    clearHistoryError: 'Erreur lors de l\'effacement de l\'historique.',
    zipFallbackMessage: 'Erreur ZIP, utilisation du fallback:',
    unableToStoreProject: 'Impossible de stocker le projet importé pour le chat:',
    
    // Warning Messages
    projectImportedChatWarning: 'Projet importé mais impossible de l\'associer au chat.',
    noActiveProjectChat: 'Aucun projet actif pour effacer l\'historique de chat.',
    noActiveProjectExport: 'Aucun projet actif pour exporter l\'historique de chat.',
    noChatHistory: 'Aucun historique de chat trouvé pour ce projet.',
    
    // Confirmation Messages
    resetConfirmation: 'Êtes-vous sûr de vouloir réinitialiser le projet ?',
    clearChatConfirmation: 'Êtes-vous sûr de vouloir effacer l\'historique de chat pour ce projet ?',
    
    // Console Messages
    generationErrorConsole: 'Erreur lors de la génération:',
    exportDataConsole: 'Données du projet à exporter:',
    fileCountConsole: 'Nombre de fichiers:',
    exportErrorConsole: 'Erreur lors de l\'export:',
    clearErrorConsole: 'Erreur lors de l\'effacement:',
    
    // File Upload
    fileAlreadyAdded: 'Ce fichier a déjà été ajouté.',
    fileReadingError: 'Erreur lors de la lecture du fichier: ',
    unsupportedFormat: 'Format de fichier non supporté. Formats acceptés : .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf',
    fileTooLarge: 'Fichier trop volumineux. Taille maximale : ',
    removeFile: 'Supprimer le fichier',
    
    // Footer
    followUs: 'Suivez-nous',
    terms: 'Conditions générales',
    privacy: 'Confidentialité',
    accessibility: 'Déclaration d\'accessibilité',
    cookies: 'Politique de cookies',
  },
  
  EN: {
    // Navigation
    generator: 'Generator',
    preview: 'Preview',
    manage: 'Management',
    
    // Generator Section
    generatorTitle: 'AI Generator',
    generatorSubtitle: 'Create your custom React project with artificial intelligence',
    projectDescription: 'Project description',
    projectDescriptionPlaceholder: 'Describe your ideal React application... Ex: A task management application with authentication, project creation, and analytical dashboard.',
    specificFeatures: 'Specific features (optional)',
    specificFeaturesPlaceholder: `List the desired specific features...
• Modern user interface with dark mode
• State management with React context
• Smooth animations and responsive design
• REST API integration`,
    referenceFiles: 'Reference files (optional)',
    generateProject: 'Generate project',
    generating: 'Generating...',
    fileUploadTip: 'Uploaded files will be analyzed by AI to better understand your code style and architectural preferences.',
    dragDropText: 'Drag and drop your files here or click to select',
    supportedFormats: 'Supported formats: .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf (max 10MB)',
    filesSelected: 'Selected files',
    
    // Preview Section
    previewTitle: 'Interactive Project',
    previewSubtitle: 'Real-time preview and modification with AI assistant',
    codeEditor: 'Code Editor',
    aiAssistant: 'AI Assistant',
    previewTip: 'Switch to the "AI Assistant" tab to modify your project by speaking naturally!',
    
    // Chat Interface
    chatTitle: 'AI Assistant',
    chatSubtitle: 'Chat with AI to modify your project in real-time',
    generateFirstProject: 'Generate a project first',
    aiAvailableAfter: 'The AI assistant will be available after generating your project',
    greeting: '👋 Hello! I am your AI assistant.',
    chatDescription: 'Describe the modifications you want to make to your project:',
    quickSuggestions: '💡 Quick suggestions:',
    chatPlaceholder: 'Describe the desired modification... (Enter to send)',
    orangeWorking: 'Orange assistant is working on your request...',
    suggestions: [
      "Change background color to blue",
      "Add a logo with a 🚀 icon",
      "Add dark theme",
      "Change button size",
      "Add animation",
      "Modify typography",
      "Add shadows and effects",
      "Change element spacing"
    ],
    
    // Management Section
    managementTitle: 'Project Management',
    managementSubtitle: 'Manage your projects, export your data and configure your work environment',
    projectManagement: 'Project Management',
    conversationHistory: 'Conversation History',
    systemConfiguration: 'System Configuration',
    
    importProject: 'Import project',
    importProjectDesc: 'Load an existing project from a JSON file',
    chooseFile: 'Choose file',
    
    exportProjectJSON: 'Export project (JSON)',
    exportProjectJSONDesc: 'Save your project in JSON format',
    downloadJSON: 'Download JSON',
    
    exportProjectZIP: 'Export project (ZIP)',
    exportProjectZIPDesc: 'Download your project with folder structure',
    downloadZIP: 'Download ZIP',
    
    exportChatHistory: 'Export chat history',
    exportChatHistoryDesc: 'Save your conversations with AI',
    exportHistory: 'Export history',
    
    clearChatHistory: 'Clear chat history',
    clearChatHistoryDesc: 'Delete conversations for this project',
    clearChatHistoryNoProject: 'Generate a project first to enable this option',
    clearHistory: 'Clear history',
    noActiveProject: 'No active project',
    
    resetEverything: 'Reset everything',
    resetEverythingDesc: 'Return to default project and clear all data',
    reset: 'Reset',
    
    currentProject: 'Current project:',
    autoSaved: 'History is automatically saved locally.',
    resetWarning: '⚠️ Warning: This action is irreversible and will delete all your data',
    
    // Success Messages
    projectGenerated: 'Project generated successfully!',
    projectImported: 'Project imported successfully!',
    projectExportedZIP: 'Project exported as ZIP successfully.',
    filesDownloaded: 'Files downloaded successfully! 🎉',
    filesDownloadedIndividually: 'All files have been downloaded individually.',
    projectReset: 'Project reset successfully.',
    chatHistoryExported: 'Chat history exported successfully!',
    chatHistoryCleared: 'Chat history cleared successfully!',
    
    // Error Messages
    generationError: 'Generation error:',
    projectDescriptionRequired: 'Please enter a project description.',
    noProjectToExport: 'No project to export. Please generate or import a project first.',
    projectImportError: 'Error importing project. Check JSON format.',
    fileReadError: 'Error reading file.',
    exportError: 'Error exporting project: ',
    resetError: 'Error resetting project.',
    connectionError: '❌ Connection error. Check that the backend server is running.',
    errorOccurred: 'An error occurred',
    clearHistoryError: 'Error clearing history.',
    zipFallbackMessage: 'ZIP error, using fallback:',
    unableToStoreProject: 'Unable to store imported project for chat:',
    
    // Warning Messages
    projectImportedChatWarning: 'Project imported but unable to associate with chat.',
    noActiveProjectChat: 'No active project to clear chat history.',
    noActiveProjectExport: 'No active project to export chat history.',
    noChatHistory: 'No chat history found for this project.',
    
    // Confirmation Messages
    resetConfirmation: 'Are you sure you want to reset the project?',
    clearChatConfirmation: 'Are you sure you want to clear chat history for this project?',
    
    // Console Messages
    generationErrorConsole: 'Generation error:',
    exportDataConsole: 'Project data to export:',
    fileCountConsole: 'Number of files:',
    exportErrorConsole: 'Export error:',
    clearErrorConsole: 'Clear error:',
    
    // File Upload
    fileAlreadyAdded: 'This file has already been added.',
    fileReadingError: 'Error reading file: ',
    unsupportedFormat: 'Unsupported file format. Accepted formats: .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf',
    fileTooLarge: 'File too large. Maximum size: ',
    removeFile: 'Remove file',
    
    // Footer
    followUs: 'Follow us',
    terms: 'Terms and conditions',
    privacy: 'Privacy',
    accessibility: 'Accessibility statement',
    cookies: 'Cookie policy',
  },
  
  ES: {
    // Navigation
    generator: 'Generador',
    preview: 'Vista previa',
    manage: 'Gestión',
    
    // Generator Section
    generatorTitle: 'Generador IA',
    generatorSubtitle: 'Crea tu proyecto React personalizado con inteligencia artificial',
    projectDescription: 'Descripción del proyecto',
    projectDescriptionPlaceholder: 'Describe tu aplicación React ideal... Ej: Una aplicación de gestión de tareas con autenticación, creación de proyectos y panel analítico.',
    specificFeatures: 'Características específicas (opcional)',
    specificFeaturesPlaceholder: `Lista las características específicas deseadas...
• Interfaz de usuario moderna con modo oscuro
• Gestión de estado con contexto React
• Animaciones suaves y diseño responsivo
• Integración API REST`,
    referenceFiles: 'Archivos de referencia (opcional)',
    generateProject: 'Generar proyecto',
    generating: 'Generando...',
    fileUploadTip: 'Los archivos subidos serán analizados por IA para entender mejor tu estilo de código y preferencias arquitectónicas.',
    dragDropText: 'Arrastra y suelta tus archivos aquí o haz clic para seleccionar',
    supportedFormats: 'Formatos soportados: .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf (máx 10MB)',
    filesSelected: 'Archivos seleccionados',
    
    // Preview Section
    previewTitle: 'Proyecto Interactivo',
    previewSubtitle: 'Vista previa y modificación en tiempo real con asistente IA',
    codeEditor: 'Editor de Código',
    aiAssistant: 'Asistente IA',
    previewTip: '¡Cambia a la pestaña "Asistente IA" para modificar tu proyecto hablando naturalmente!',
    
    // Chat Interface
    chatTitle: 'Asistente IA',
    chatSubtitle: 'Chatea con IA para modificar tu proyecto en tiempo real',
    generateFirstProject: 'Genera un proyecto primero',
    aiAvailableAfter: 'El asistente IA estará disponible después de generar tu proyecto',
    greeting: '👋 ¡Hola! Soy tu asistente IA.',
    chatDescription: 'Describe las modificaciones que quieres hacer a tu proyecto:',
    quickSuggestions: '💡 Sugerencias rápidas:',
    chatPlaceholder: 'Describe la modificación deseada... (Enter para enviar)',
    orangeWorking: 'El asistente Orange está trabajando en tu solicitud...',
    suggestions: [
      "Cambia el color de fondo a azul",
      "Añade un logo con icono 🚀",
      "Pon tema oscuro",
      "Cambia el tamaño de los botones",
      "Añade animación",
      "Modifica la tipografía",
      "Añade sombras y efectos",
      "Cambia el espaciado de elementos"
    ],
    
    // Management Section
    managementTitle: 'Gestión de Proyectos',
    managementSubtitle: 'Gestiona tus proyectos, exporta tus datos y configura tu entorno de trabajo',
    projectManagement: 'Gestión de Proyectos',
    conversationHistory: 'Historial de Conversaciones',
    systemConfiguration: 'Configuración del Sistema',
    
    importProject: 'Importar proyecto',
    importProjectDesc: 'Cargar un proyecto existente desde archivo JSON',
    chooseFile: 'Elegir archivo',
    
    exportProjectJSON: 'Exportar proyecto (JSON)',
    exportProjectJSONDesc: 'Guardar tu proyecto en formato JSON',
    downloadJSON: 'Descargar JSON',
    
    exportProjectZIP: 'Exportar proyecto (ZIP)',
    exportProjectZIPDesc: 'Descargar tu proyecto con estructura de carpetas',
    downloadZIP: 'Descargar ZIP',
    
    exportChatHistory: 'Exportar historial de chat',
    exportChatHistoryDesc: 'Guardar tus conversaciones con IA',
    exportHistory: 'Exportar historial',
    
    clearChatHistory: 'Limpiar historial de chat',
    clearChatHistoryDesc: 'Eliminar conversaciones para este proyecto',
    clearChatHistoryNoProject: 'Genera un proyecto primero para activar esta opción',
    clearHistory: 'Limpiar historial',
    noActiveProject: 'Sin proyecto activo',
    
    resetEverything: 'Resetear todo',
    resetEverythingDesc: 'Volver al proyecto por defecto y borrar todos los datos',
    reset: 'Resetear',
    
    currentProject: 'Proyecto actual:',
    autoSaved: 'El historial se guarda automáticamente localmente.',
    resetWarning: '⚠️ Advertencia: Esta acción es irreversible y eliminará todos tus datos',
    
    // Success Messages
    projectGenerated: '¡Proyecto generado exitosamente!',
    projectImported: '¡Proyecto importado exitosamente!',
    projectExportedZIP: 'Proyecto exportado en ZIP exitosamente.',
    filesDownloaded: '¡Archivos descargados exitosamente! 🎉',
    filesDownloadedIndividually: 'Todos los archivos han sido descargados individualmente.',
    projectReset: 'Proyecto reseteado exitosamente.',
    chatHistoryExported: '¡Historial de chat exportado exitosamente!',
    chatHistoryCleared: '¡Historial de chat limpiado exitosamente!',
    
    // Error Messages
    generationError: 'Error en la generación:',
    projectDescriptionRequired: 'Por favor ingresa una descripción del proyecto.',
    noProjectToExport: 'No hay proyecto para exportar. Por favor genera o importa un proyecto primero.',
    projectImportError: 'Error importando proyecto. Verifica el formato JSON.',
    fileReadError: 'Error leyendo archivo.',
    exportError: 'Error exportando proyecto: ',
    resetError: 'Error reseteando proyecto.',
    connectionError: '❌ Error de conexión. Verifica que el servidor backend esté funcionando.',
    errorOccurred: 'Ocurrió un error',
    clearHistoryError: 'Error limpiando historial.',
    zipFallbackMessage: 'Error ZIP, usando fallback:',
    unableToStoreProject: 'No se puede almacenar el proyecto importado para chat:',
    
    // Warning Messages
    projectImportedChatWarning: 'Proyecto importado pero no se pudo asociar con chat.',
    noActiveProjectChat: 'No hay proyecto activo para limpiar historial de chat.',
    noActiveProjectExport: 'No hay proyecto activo para exportar historial de chat.',
    noChatHistory: 'No se encontró historial de chat para este proyecto.',
    
    // Confirmation Messages
    resetConfirmation: '¿Estás seguro de que quieres resetear el proyecto?',
    clearChatConfirmation: '¿Estás seguro de que quieres limpiar el historial de chat para este proyecto?',
    
    // Console Messages
    generationErrorConsole: 'Error de generación:',
    exportDataConsole: 'Datos del proyecto a exportar:',
    fileCountConsole: 'Número de archivos:',
    exportErrorConsole: 'Error de exportación:',
    clearErrorConsole: 'Error de limpieza:',
    
    // File Upload
    fileAlreadyAdded: 'Este archivo ya ha sido añadido.',
    fileReadingError: 'Error leyendo archivo: ',
    unsupportedFormat: 'Formato de archivo no soportado. Formatos aceptados: .txt, .js, .jsx, .ts, .tsx, .css, .html, .json, .md, .xml, .pdf',
    fileTooLarge: 'Archivo demasiado grande. Tamaño máximo: ',
    removeFile: 'Remover archivo',
    
    // Footer
    followUs: 'Síguenos',
    terms: 'Términos y condiciones',
    privacy: 'Privacidad',
    accessibility: 'Declaración de accesibilidad',
    cookies: 'Política de cookies',
  }
};

// Translation Context
const TranslationContext = createContext();

// Translation Provider Component
export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage && translations[savedLanguage] ? savedLanguage : 'FR';
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  const t = (key, params = {}) => {
    let translation = translations[currentLanguage][key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
    }
  };

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      availableLanguages: Object.keys(translations)
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};