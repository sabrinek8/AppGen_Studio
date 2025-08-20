import React from 'react';
import { Card, SectionHeader, Button, Textarea } from '../UI';
import { FileUpload } from '../UI/FileUpload';
import { Brain } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export const GeneratorSection = ({
  projectDescription,
  setProjectDescription,
  projectFeatures,
  setProjectFeatures,
  isGenerating,
  onGenerate,
  selectedFiles,
  onFileSelect,
  onFileRemove
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionHeader
        icon={<Brain size={27} />}
        title={t('generatorTitle')}
        subtitle={t('generatorSubtitle')}
      />

      <div style={{
        display: 'grid',
        gap: '24px',
        marginBottom: '30px'
      }}>
        <Textarea
          id="projectDescription"
          label={t('projectDescription')}
          icon="💡"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder={t('projectDescriptionPlaceholder')}
          rows={5}
          required
        />

        <Textarea
          id="projectFeatures"
          label={t('specificFeatures')}
          icon="⚡"
          value={projectFeatures}
          onChange={(e) => setProjectFeatures(e.target.value)}
          placeholder={t('specificFeaturesPlaceholder')}
          rows={6}
        />
        
        <FileUpload
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          selectedFiles={selectedFiles}
        />

        {selectedFiles.length > 0 && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            border: '1px solid #c3e6c3',
            fontSize: '14px',
            color: '#2d5a2d'
          }}>
            <strong>💡 {t('fileUploadTip').split(':')[0]}:</strong> {t('fileUploadTip')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          type="button" 
          className="btn btn-outline-secondary btn-lg"
          onClick={onGenerate}
          disabled={isGenerating || !projectDescription.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {t('generating')}
            </>
          ) : (
            <>
              <span style={{ marginRight: '8px' }}>✨</span>
              {t('generateProject')}
            </>
          )}
        </button>
      </div>
    </Card>
  );
};