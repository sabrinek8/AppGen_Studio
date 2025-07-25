// utils/zipExport.js

/**
 * Creates a real ZIP file using JSZip library loaded from CDN
 * @param {Object} projectData - The project data object with file paths as keys and code as values
 * @param {string} projectName - Name for the ZIP file (optional)
 */
export const exportProjectAsZip = async (projectData, projectName = 'react-project') => {
  try {
    // Load JSZip from CDN if not already loaded
    if (!window.JSZip) {
      console.log('Chargement de JSZip depuis CDN...');
      await loadJSZipFromCDN();
    }

    const JSZip = window.JSZip;
    const zip = new JSZip();
    
    console.log('Création du ZIP avec les fichiers:', Object.keys(projectData));
    
    // Add each file to the ZIP with its proper path and content
    Object.entries(projectData).forEach(([filePath, content]) => {
      // Clean the file path - remove leading slash if present
      let cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      
      // Ensure we have a valid file path
      if (!cleanPath || cleanPath.trim() === '') {
        cleanPath = 'index.js'; // Default filename
      }
      
      console.log(`Ajout du fichier: ${cleanPath}, taille: ${content ? content.length : 0} caractères`);
      
      // Add file to ZIP with its content
      zip.file(cleanPath, content || '// Fichier vide\n');
    });
    
    console.log('Génération du fichier ZIP...');
    
    // Generate the ZIP file as blob
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });
    
    console.log(`ZIP généré, taille: ${zipBlob.size} bytes`);
    
    // Create and trigger download
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}.zip`;
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('Projet exporté avec succès en ZIP!');
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'export ZIP:', error);
    throw error;
  }
};

/**
 * Load JSZip library from CDN
 */
function loadJSZipFromCDN() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.JSZip) {
      resolve();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => {
      console.log('JSZip chargé avec succès');
      resolve();
    };
    script.onerror = () => {
      console.error('Erreur lors du chargement de JSZip');
      reject(new Error('Impossible de charger JSZip depuis le CDN'));
    };
    
    // Add to document
    document.head.appendChild(script);
  });
}

/**
 * Fallback method - creates a ZIP-like structure using browser APIs
 * @param {Object} projectData - The project data object
 * @param {string} projectName - Name for the ZIP file
 */
export const exportProjectAsZipFallback = async (projectData, projectName = 'react-project') => {
  try {
    // Create a manual ZIP structure
    const zipData = await createManualZip(projectData);
    
    // Create blob and download
    const blob = new Blob([zipData], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}.zip`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log('Projet exporté avec méthode fallback');
    return true;
    
  } catch (error) {
    console.error('Erreur avec la méthode fallback:', error);
    // Last resort - download individual files
    return exportProjectAsIndividualFiles(projectData, projectName);
  }
};

/**
 * Creates a manual ZIP structure (simplified)
 */
async function createManualZip(projectData) {
  const files = [];
  const fileEntries = [];
  let offset = 0;

  // Process each file
  for (const [filePath, content] of Object.entries(projectData)) {
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const fileContent = new TextEncoder().encode(content || '');
    const fileName = new TextEncoder().encode(cleanPath);
    
    // Create local file header (simplified ZIP format)
    const localHeader = new Uint8Array(30 + fileName.length);
    
    // ZIP local file header signature
    localHeader[0] = 0x50; // P
    localHeader[1] = 0x4B; // K  
    localHeader[2] = 0x03; // 
    localHeader[3] = 0x04; // 
    
    // Version needed to extract (2.0)
    localHeader[4] = 0x14;
    localHeader[5] = 0x00;
    
    // General purpose flag
    localHeader[6] = 0x00;
    localHeader[7] = 0x00;
    
    // Compression method (0 = stored, no compression)
    localHeader[8] = 0x00;
    localHeader[9] = 0x00;
    
    // Last mod file time & date (dummy values)
    localHeader[10] = 0x00;
    localHeader[11] = 0x00;
    localHeader[12] = 0x00;
    localHeader[13] = 0x00;
    
    // CRC-32 (simplified - using 0)
    localHeader[14] = 0x00;
    localHeader[15] = 0x00;
    localHeader[16] = 0x00;
    localHeader[17] = 0x00;
    
    // Compressed size
    const compSize = fileContent.length;
    localHeader[18] = compSize & 0xFF;
    localHeader[19] = (compSize >> 8) & 0xFF;
    localHeader[20] = (compSize >> 16) & 0xFF;
    localHeader[21] = (compSize >> 24) & 0xFF;
    
    // Uncompressed size (same as compressed since no compression)
    localHeader[22] = compSize & 0xFF;
    localHeader[23] = (compSize >> 8) & 0xFF;
    localHeader[24] = (compSize >> 16) & 0xFF;
    localHeader[25] = (compSize >> 24) & 0xFF;
    
    // File name length
    localHeader[26] = fileName.length & 0xFF;
    localHeader[27] = (fileName.length >> 8) & 0xFF;
    
    // Extra field length
    localHeader[28] = 0x00;
    localHeader[29] = 0x00;
    
    // Add file name to header
    localHeader.set(fileName, 30);
    
    // Store file entry info for central directory
    fileEntries.push({
      path: cleanPath,
      pathBytes: fileName,
      offset: offset,
      size: compSize,
      headerSize: localHeader.length
    });
    
    files.push(localHeader);
    files.push(fileContent);
    
    offset += localHeader.length + fileContent.length;
  }
  
  // Create central directory (simplified)
  const centralDirStart = offset;
  const centralDirEntries = [];
  
  for (const entry of fileEntries) {
    const centralHeader = new Uint8Array(46 + entry.pathBytes.length);
    
    // Central directory signature
    centralHeader[0] = 0x50; // P
    centralHeader[1] = 0x4B; // K
    centralHeader[2] = 0x01; // 
    centralHeader[3] = 0x02; // 
    
    // Version made by & version needed
    centralHeader[4] = 0x14;
    centralHeader[5] = 0x00;
    centralHeader[6] = 0x14;
    centralHeader[7] = 0x00;
    
    // Skip most fields (set to 0)
    // ... (simplified for brevity)
    
    // File name length
    centralHeader[28] = entry.pathBytes.length & 0xFF;
    centralHeader[29] = (entry.pathBytes.length >> 8) & 0xFF;
    
    // Relative offset of local header
    centralHeader[42] = entry.offset & 0xFF;
    centralHeader[43] = (entry.offset >> 8) & 0xFF;
    centralHeader[44] = (entry.offset >> 16) & 0xFF;
    centralHeader[45] = (entry.offset >> 24) & 0xFF;
    
    // Add file name
    centralHeader.set(entry.pathBytes, 46);
    
    centralDirEntries.push(centralHeader);
  }
  
  files.push(...centralDirEntries);
  
  // End of central directory record
  const endRecord = new Uint8Array(22);
  endRecord[0] = 0x50; // P
  endRecord[1] = 0x4B; // K
  endRecord[2] = 0x05; // 
  endRecord[3] = 0x06; // 
  
  // Number of entries
  endRecord[8] = fileEntries.length & 0xFF;
  endRecord[9] = (fileEntries.length >> 8) & 0xFF;
  endRecord[10] = fileEntries.length & 0xFF;
  endRecord[11] = (fileEntries.length >> 8) & 0xFF;
  
  files.push(endRecord);
  
  // Combine all parts
  const totalSize = files.reduce((sum, part) => sum + part.length, 0);
  const zipBuffer = new Uint8Array(totalSize);
  let pos = 0;
  
  for (const part of files) {
    zipBuffer.set(part, pos);
    pos += part.length;
  }
  
  return zipBuffer;
}

/**
 * Last resort - download files individually with proper names
 * @param {Object} projectData - The project data object  
 * @param {string} projectName - Base name for files
 */
export const exportProjectAsIndividualFiles = (projectData, projectName = 'react-project') => {
  console.log('Téléchargement des fichiers individuels...');
  
  const files = Object.entries(projectData);
  
  files.forEach(([filePath, content], index) => {
    setTimeout(() => {
      // Clean the file path and create a proper filename
      let fileName = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      fileName = fileName.replace(/\//g, '-') || `file-${index}.txt`;
      
      const blob = new Blob([content || '// Fichier vide'], { 
        type: 'text/plain;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`Fichier téléchargé: ${fileName}`);
    }, index * 300); // Delay between downloads
  });
  
  return true;
};

/**
 * Simple method that just downloads individual files (legacy)
 */
export const exportProjectAsZipSimple = exportProjectAsIndividualFiles;