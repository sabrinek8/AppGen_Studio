import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  const readFileContent = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject(new Error(`Erreur lors de la lecture du fichier ${file.name}`));
      };
      reader.readAsText(file);
    });
  }, []);

  const addFile = useCallback(async (file) => {
    // Vérifier si le fichier n'est pas déjà ajouté
    const isAlreadyAdded = selectedFiles.some(f => 
      f.name === file.name && f.size === file.size
    );
    
    if (isAlreadyAdded) {
      alert('Ce fichier a déjà été ajouté.');
      return;
    }

    try {
      const content = await readFileContent(file);
      
      setSelectedFiles(prev => [...prev, file]);
      setFileContents(prev => ({
        ...prev,
        [file.name]: content
      }));
    } catch (error) {
      alert(`Erreur lors de la lecture du fichier: ${error.message}`);
    }
  }, [selectedFiles, readFileContent]);

  const removeFile = useCallback((index) => {
    const file = selectedFiles[index];
    if (file) {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setFileContents(prev => {
        const newContents = { ...prev };
        delete newContents[file.name];
        return newContents;
      });
    }
  }, [selectedFiles]);

  const clearAllFiles = useCallback(() => {
    setSelectedFiles([]);
    setFileContents({});
  }, []);

  const getFilesContext = useCallback(() => {
    if (selectedFiles.length === 0) return '';
    
    let context = '\n\n--- FICHIERS DE RÉFÉRENCE ---\n';
    
    selectedFiles.forEach((file) => {
      const content = fileContents[file.name];
      if (content) {
        context += `\n📄 ${file.name}:\n`;
        context += '```\n';
        context += content;
        context += '\n```\n';
      }
    });
    
    context += '\n--- FIN DES FICHIERS DE RÉFÉRENCE ---\n';
    context += 'Veuillez prendre en compte le contenu de ces fichiers pour générer le projet React.\n';
    
    return context;
  }, [selectedFiles, fileContents]);

  return {
    selectedFiles,
    fileContents,
    addFile,
    removeFile,
    clearAllFiles,
    getFilesContext
  };
};