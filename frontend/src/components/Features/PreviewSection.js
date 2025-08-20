import React, { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { githubLight } from "@codesandbox/sandpack-themes";
import { Card, SectionHeader } from '../UI';
import { ChatInterface } from './ChatInterface';
import { Columns2, MessageCircle, Code, Layout } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export const PreviewSection = ({ 
  currentProject, 
  selectedFile, 
  projectId,
  onProjectUpdate 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('preview');

  const TabButton = ({ id, icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        backgroundColor: isActive ? '#ff7900' : 'transparent',
        color: isActive ? 'white' : '#666',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        borderBottom: isActive ? 'none' : '1px solid #e9ecef'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = '#f8f9fa';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <Card style={{ padding: '0', overflow: 'hidden' }}>
      {/* Header with tabs */}
      <div style={{ padding: '30px 30px 0 30px' }}>
        <SectionHeader
          icon={<Layout size={24} />}
          title={t('previewTitle')}
          subtitle={t('previewSubtitle')}
        />
        
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e9ecef',
          marginBottom: '0'
        }}>
          <TabButton
            id="preview"
            icon={<Code size={16} />}
            label={t('codeEditor')}
            isActive={activeTab === 'preview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="chat"
            icon={<MessageCircle size={16} />}
            label={t('aiAssistant')}
            isActive={activeTab === 'chat'}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '30px' }}>
        {activeTab === 'preview' && (
          <div style={{
            border: '2px solid #e9ecef',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <Sandpack
              template="react"
              theme={githubLight}
              files={currentProject}
              options={{
                showNavigator: true,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: 500,
                activeFile: selectedFile,
                readOnly: false
              }}
              customSetup={{
                dependencies: {
                  "react-native-web": "0.18.12",
                  "@react-navigation/native": "^6.1.6",
                  "@react-navigation/stack": "^6.3.20",
                  "react-native-screens": "^3.27.0",
                  "react-native-safe-area-context": "^4.7.4",
                  "react-native-gesture-handler": "^2.13.4",
                  "@expo/vector-icons": "14.1.0"
                }
              }}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatInterface
            projectId={projectId}
            onProjectUpdate={onProjectUpdate}
            isVisible={activeTab === 'chat'}
          />
        )}
      </div>

      {/* Quick action hint */}
      {activeTab === 'preview' && projectId && (
        <div style={{
          padding: '16px 30px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <MessageCircle size={16} />
          <span>
            {t('previewTip')}
          </span>
        </div>
      )}
    </Card>
  );
};