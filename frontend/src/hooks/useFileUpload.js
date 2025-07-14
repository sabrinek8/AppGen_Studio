import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  const isPDF = (file) => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };

  const extractPDFText = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/pdf/extract-pdf-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'extraction du PDF');
      }

      const result = await response.json();
      
      if (result.success && result.text_content) {
        return result.text_content;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'extraction du texte PDF');
      }
    } catch (error) {
      throw new Error(`Erreur lors du traitement du PDF: ${error.message}`);
    }
  };

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
      let content;
      
      if (isPDF(file)) {
        content = await extractPDFText(file);
      } else {
        content = await readFileContent(file);
      }
      
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
        const fileType = isPDF(file) ? 'PDF' : file.name.split('.').pop()?.toUpperCase();
        context += `\n📄 ${file.name} (${fileType}):\n`;
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