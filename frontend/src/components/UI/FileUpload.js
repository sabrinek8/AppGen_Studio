import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const FileUpload = ({ onFileSelect, onFileRemove, selectedFiles = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const { t } = useTranslation();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    });
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    });
  };

  const isValidFile = (file) => {
    const allowedTypes = [
      'text/plain',
      'application/json',
      'text/css',
      'text/javascript',
      'application/javascript',
      'text/html',
      'text/markdown',
      'application/xml',
      'text/xml',
      'application/pdf'
    ];
    
    const maxSizeForPdf = 10 * 1024 * 1024; // 10MB
    const maxSizeForOthers = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|js|jsx|ts|tsx|css|html|json|md|xml|pdf)$/i)) {
      alert(t('unsupportedFormat'));
      return false;
    }
    
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const currentMaxSize = isPDF ? maxSizeForPdf : maxSizeForOthers;
    
    if (file.size > currentMaxSize) {
      alert(t('fileTooLarge') + (isPDF ? '10MB' : '5MB'));
      return false;
    }
    
    return true;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
      js: '🟨',
      jsx: '⚛️',
      ts: '🔷',
      tsx: '⚛️',
      css: '🎨',
      html: '🌐',
      json: '📄',
      md: '📝',
      txt: '📄',
      xml: '📄',
      pdf: '📕',
    };
    return iconMap[ext] || '📄';
  };

  return (
    <div className="mb-3">
      <label htmlFor="referenceFiles" className="form-label">
        📎 {t('referenceFiles')}
      </label>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        style={{
          border: `2px dashed ${dragActive ? '#667eea' : '#e9ecef'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(102, 126, 234, 0.1)' : '#f8f9fa',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          multiple
          accept=".txt,.js,.jsx,.ts,.tsx,.css,.html,.json,.md,.xml,.pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-upload"
        />
        
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '10px'
          }}>
            📁
          </div>
          <p style={{
            margin: '0 0 10px 0',
            color: '#f16e00',
            fontWeight: '600'
          }}>
            {t('dragDropText')}
          </p>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            {t('supportedFormats')}
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{
            margin: '0 0 10px 0',
            color: '#2c3e50',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {t('filesSelected')} ({selectedFiles.length})
          </h4>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>
                    {getFileIcon(file.name)}
                  </span>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      {file.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#7f8c8d'
                    }}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onFileRemove(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e74c3c',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  title={t('removeFile')}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};