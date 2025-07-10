export const useFileHandler = () => {
  const importFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target.result);
          resolve(projectData);
        } catch (error) {
          reject(new Error("Erreur lors de l'importation du projet. Vérifiez le format JSON."));
        }
      };
      reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier."));
      reader.readAsText(file);
    });
  };

  return {
    importFromFile
  };
};