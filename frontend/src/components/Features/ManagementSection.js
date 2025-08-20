import React, { useState } from 'react';
import { ManagementCard } from '../UI';
import { FolderOpen, Save, RotateCcw, Archive, MessageSquare, Trash2, Settings, Database } from 'lucide-react';
import { exportChatHistory } from '../../utils/chatUtils';
import { useTranslation } from '../../contexts/TranslationContext';

export const ManagementSection = ({
  onImport,
  onExport,
  onExportZip,
  onReset,
  onClearChatHistory,
  currentProject,
  currentProjectId
}) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger' | 'info', message: string }

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  const handleExportZip = () => {
    if (!currentProject || Object.keys(currentProject).length === 0) {
      setAlert({
        type: 'danger',
        message: t('noProjectToExport')
      });
      return;
    }
    onExportZip(currentProject);
    setAlert({
      type: 'success',
      message: t('projectExportedZIP')
    });
  };

  const handleExportChatHistory = () => {
    if (!currentProjectId) {
      setAlert({
        type: 'warning',
        message: t('noActiveProjectExport')
      });
      return;
    }

    const success = exportChatHistory(currentProjectId);
    if (success) {
      setAlert({
        type: 'success',
        message: t('chatHistoryExported')
      });
    } else {
      setAlert({
        type: 'danger',
        message: t('noChatHistory')
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '32px 20px'
    }}>

      {/* Boosted Orange Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert" style={{ maxWidth: '1000px', margin: '0 auto 20px auto' }}>
          <span className="alert-icon "></span>
          <p style={{ margin: 0 }}>{alert.message}</p>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Header Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 48px auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '12px',
          letterSpacing: '-0.025em'
        }}>
          {t('managementTitle')}
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {t('managementSubtitle')}
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: '32px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
      }}>
        
        {/* Project Management Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#3b82f6',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <Database size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              {t('projectManagement')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ManagementCard
              icon={<FolderOpen />}
              title={t('importProject')}
              subtitle={t('importProjectDesc')}
              variant="info"
              action={() => {
                document.getElementById('import-input').click();
              }}
              actionLabel={t('chooseFile')}
            />

            <ManagementCard
              icon={<Save />}
              title={t('exportProjectJSON')}
              subtitle={t('exportProjectJSONDesc')}
              variant="info"
              action={onExport}
              actionLabel={t('downloadJSON')}
            />

            <ManagementCard
              icon={<Archive />}
              title={t('exportProjectZIP')}
              subtitle={t('exportProjectZIPDesc')}
              variant="info"
              action={handleExportZip}
              actionLabel={t('downloadZIP')}
            />
          </div>
        </div>

        {/* Chat History Management Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#10b981',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <MessageSquare size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              {t('conversationHistory')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ManagementCard
              icon={<MessageSquare />}
              title={t('exportChatHistory')}
              subtitle={t('exportChatHistoryDesc')}
              variant="success"
              action={handleExportChatHistory}
              actionLabel={t('exportHistory')}
            />

            <ManagementCard
              icon={<Trash2 />}
              title={t('clearChatHistory')}
              subtitle={currentProjectId 
                ? t('clearChatHistoryDesc') 
                : t('clearChatHistoryNoProject')
              }
              variant="warning"
              action={currentProjectId && onClearChatHistory ? onClearChatHistory : null}
              actionLabel={currentProjectId ? t('clearHistory') : t('noActiveProject')}
            />

            {currentProjectId && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                fontSize: '14px',
                color: '#166534',
                marginTop: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <div>
                    <strong>{t('currentProject')}</strong> {currentProjectId.slice(0, 8)}...
                    <br />
                    <span style={{ fontSize: '13px', color: '#15803d' }}>
                      {t('autoSaved')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Management Section - Full Width */}
      <div style={{
        maxWidth: '1200px',
        margin: '32px auto 0 auto'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <div style={{
              backgroundColor: '#ef4444',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <Settings size={20} color="white" />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: 0
            }}>
              {t('systemConfiguration')}
            </h2>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '400px' }}>
              <ManagementCard
                icon={<RotateCcw />}
                title={t('resetEverything')}
                subtitle={t('resetEverythingDesc')}
                variant="danger"
                action={onReset}
                actionLabel={t('reset')}
              />
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#dc2626',
              fontSize: '14px',
              margin: 0,
              fontWeight: '500'
            }}>
              {t('resetWarning')}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".json"
        onChange={handleImportFile}
        style={{ display: 'none' }}
        id="import-input"
      />
    </div>
  );
};