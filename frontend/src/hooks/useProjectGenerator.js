import { useState } from 'react';

export const useProjectGenerator = () => {
  const [projectDescription, setProjectDescription] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const API_BASE_URL = "http://localhost:8000";

  const generateProject = async () => {
    if (!projectDescription.trim()) {
      throw new Error("Veuillez entrer une description du projet.");
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: projectDescription,
          features: projectFeatures
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.project_data) {
        return data.project_data;
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setProjectDescription("");
    setProjectFeatures("");
  };

  return {
    projectDescription,
    setProjectDescription,
    projectFeatures,
    setProjectFeatures,
    isGenerating,
    generateProject,
    resetForm
  };
};
