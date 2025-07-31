/**
 * Clear all chat-related data from localStorage
 */
export const clearAllChatData = () => {
  const keys = Object.keys(localStorage);
  const chatKeys = keys.filter(key => 
    key.startsWith('chat_messages_') || 
    key === 'current_project_id' || 
    key === 'project_version' ||
    key === 'last_synced_project'
  );
  
  chatKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleared ${chatKeys.length} chat-related localStorage items`);
};

/**
 * Clear chat history for a specific project
 */
export const clearProjectChatHistory = (projectId) => {
  if (projectId) {
    localStorage.removeItem(`chat_messages_${projectId}`);
    console.log(`Cleared chat history for project: ${projectId}`);
  }
};

/**
 * Get all stored chat project IDs
 */
export const getStoredChatProjects = () => {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith('chat_messages_'))
    .map(key => key.replace('chat_messages_', ''));
};

/**
 * Export chat history for a project
 */
export const exportChatHistory = (projectId) => {
  try {
    const chatData = localStorage.getItem(`chat_messages_${projectId}`);
    if (chatData) {
      const messages = JSON.parse(chatData);
      const exportData = {
        projectId,
        exportDate: new Date().toISOString(),
        messageCount: messages.length,
        messages
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileName = `chat-history-${projectId.slice(0, 8)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error exporting chat history:', error);
    return false;
  }
};