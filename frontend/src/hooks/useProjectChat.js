// frontend/src/hooks/useProjectChat.js
import { useState, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';

export const useProjectChat = () => {
  const [currentProjectId, setCurrentProjectId] = usePersistentState('current_project_id', null);
  const [projectVersion, setProjectVersion] = usePersistentState('project_version', 1);

  const API_BASE_URL = "http://localhost:8000";

  const storeProject = useCallback(async (projectData) => {
    try {
      // Extract actual files from the response structure
      const files = projectData.files || projectData;
      const projectId = projectData.project_id;

      if (projectId) {
        // Project is already stored by the backend
        setCurrentProjectId(projectId);
        setProjectVersion(1);
        return projectId;
      } else {
        // Fallback: store manually if needed
        const response = await fetch(`${API_BASE_URL}/api/chat/projects/store-manual`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: `manual-${Date.now()}`,
            project_data: files
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newProjectId = data.project_id;
          setCurrentProjectId(newProjectId);
          setProjectVersion(1);
          return newProjectId;
        } else {
          throw new Error('Erreur lors du stockage du projet');
        }
      }
    } catch (error) {
      console.error('Erreur lors du stockage du projet:', error);
      throw error;
    }
  }, []);

  const sendChatMessage = useCallback(async (projectId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/chat/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.project_version) {
        setProjectVersion(data.project_version);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }, []);

  const getChatHistory = useCallback(async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/chat/${projectId}/history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  }, []);

  const getProject = useCallback(async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      throw error;
    }
  }, []);

  const resetProject = useCallback(() => {
    setCurrentProjectId(null);
    setProjectVersion(1);
  }, []);

  return {
    currentProjectId,
    projectVersion,
    storeProject,
    sendChatMessage,
    getChatHistory,
    getProject,
    resetProject
  };
};