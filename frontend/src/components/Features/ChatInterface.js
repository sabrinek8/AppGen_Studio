// frontend/src/components/Features/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import { Card, SectionHeader } from '../UI';
import { MessageCircle, Send, Loader, Sparkles } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';

export const ChatInterface = ({ projectId, onProjectUpdate, isVisible }) => {
  const [messages, setMessages] = usePersistentState(`chat_messages_${projectId}`, []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedProject, setLastSyncedProject] = usePersistentState('last_synced_project', null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Load chat history when project changes or component mounts
  useEffect(() => {
    if (projectId && projectId !== lastSyncedProject) {
      loadChatHistory();
      setLastSyncedProject(projectId);
    }
  }, [projectId, lastSyncedProject, setLastSyncedProject]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/chat/chat/${projectId}/history`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.chat_history) {
          // Only sync if server has more recent data
          const serverMessages = data.chat_history || [];
          const localMessages = messages || [];
          
          // Compare lengths to determine if we need to sync
          if (serverMessages.length > localMessages.length) {
            console.log('Syncing chat history from server');
            setMessages(serverMessages);
          } else if (localMessages.length > serverMessages.length) {
            console.log('Local history is more recent, keeping local data');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !projectId) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    // Update messages immediately for better UX
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/chat/chat/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString()
        };

        // Update messages with bot response
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);

        // Update project if modifications were made
        if (data.updated_project) {
          onProjectUpdate(data.updated_project);
        }
      } else {
        const errorMessage = {
          role: 'assistant',
          content: `❌ ${data.message || 'Une erreur est survenue'}`,
          timestamp: new Date().toISOString()
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Erreur de connexion. Vérifiez que le serveur backend fonctionne.',
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickSuggestions = [
    "Change la couleur de fond en bleu",
    "Ajoute un logo avec une icône 🚀",
    "Met un thème sombre",
    "Change la taille des boutons",
    "Ajoute une animation"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <SectionHeader
        icon={<MessageCircle size={24} />}
        title="Assistant IA"
        subtitle="Discutez avec l'IA pour modifier votre projet en temps réel"
      />

      {!projectId ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#7f8c8d',
          textAlign: 'center'
        }}>
          <Sparkles size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            Générez d'abord un projet
          </p>
          <p style={{ fontSize: '14px' }}>
            L'assistant sera disponible après la génération
          </p>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#7f8c8d',
                padding: '40px 20px'
              }}>
                <MessageCircle size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                  👋 Bonjour ! Je suis votre assistant IA.
                </p>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                  Décrivez-moi les modifications que vous souhaitez apporter à votre projet :
                </p>
                
                {/* Quick Suggestions */}
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px', color: '#6c757d' }}>
                    💡 Suggestions rapides :
                  </p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#e3f2fd',
                          border: '1px solid #bbdefb',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          color: '#1976d2'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#bbdefb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#e3f2fd';
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: message.role === 'user' ? '#667eea' : '#ffffff',
                    color: message.role === 'user' ? 'white' : '#2c3e50',
                    border: message.role === 'assistant' ? '1px solid #e9ecef' : 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {message.content}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Loader size={16} className="animate-spin" />
                  <span style={{ fontSize: '14px', color: '#7f8c8d' }}>
                    L'IA travaille sur votre demande...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Décrivez la modification souhaitée... (Entrée pour envoyer)"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
                fontSize: '14px',
                resize: 'none',
                minHeight: '48px',
                maxHeight: '120px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
            
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                padding: '12px',
                backgroundColor: inputMessage.trim() && !isLoading ? '#667eea' : '#e9ecef',
                color: inputMessage.trim() && !isLoading ? 'white' : '#adb5bd',
                border: 'none',
                borderRadius: '12px',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                minWidth: '48px',
                height: '48px'
              }}
            >
              {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </>
      )}
    </Card>
  );
};