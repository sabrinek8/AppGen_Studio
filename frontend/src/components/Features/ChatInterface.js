import React, { useState, useRef, useEffect } from 'react';
import { Card, SectionHeader } from '../UI';
import { MessageCircle, Send, Loader, Sparkles } from 'lucide-react';
import { usePersistentState } from '../../hooks/usePersistentState';

export const ChatInterface = ({ projectId, onProjectUpdate, isVisible }) => {
  const [messages, setMessages] = usePersistentState(`chat_messages_${projectId}`, []);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedProject, setLastSyncedProject] = usePersistentState('last_synced_project', null);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionIntervalRef = useRef(null);

  // Orange Boosted Color Palette
  const colors = {
    primary: '#FF7900',      // Orange primary
    primaryHover: '#E55B00',  // Orange hover
    secondary: '#000000',     // Black
    success: '#32C832',       // Green
    info: '#527EDB',         // Blue
    warning: '#FC0',         // Yellow
    danger: '#CD113B',       // Red
    light: '#F6F6F6',        // Light gray
    dark: '#000000',         // Black
    white: '#FFFFFF',        // White
    gray100: '#F6F6F6',
    gray200: '#E5E5E5',
    gray300: '#CCCCCC',
    gray400: '#999999',
    gray500: '#666666',
    gray600: '#4D4D4D',
    gray700: '#333333',
    gray800: '#1A1A1A',
    gray900: '#000000',
  };

  const quickSuggestions = [
    "Change la couleur de fond en bleu",
    "Ajoute un logo avec une icône 🚀",
    "Met un thème sombre",
    "Change la taille des boutons",
    "Ajoute une animation",
    "Modifie la typographie",
    "Ajoute des ombres et effets",
    "Change l'espacement des éléments"
  ];

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

  // Auto-slide suggestions animation
  useEffect(() => {
    if (messages.length === 0 && projectId) {
      suggestionIntervalRef.current = setInterval(() => {
        setCurrentSuggestionIndex((prevIndex) => 
          (prevIndex + 1) % quickSuggestions.length
        );
      }, 3000); // Change suggestion every 3 seconds
    }

    return () => {
      if (suggestionIntervalRef.current) {
        clearInterval(suggestionIntervalRef.current);
      }
    };
  }, [messages.length, projectId, quickSuggestions.length]);

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

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  // Get visible suggestions for sliding animation
  const getVisibleSuggestions = () => {
    const visibleCount = 3; // Show 3 suggestions at a time
    const suggestions = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentSuggestionIndex + i) % quickSuggestions.length;
      suggestions.push({
        text: quickSuggestions[index],
        index: index
      });
    }
    
    return suggestions;
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card style={{ 
      height: '600px', 
      display: 'flex', 
      flexDirection: 'column',
      border: `1px solid ${colors.gray200}`,
      borderRadius: '12px',
      backgroundColor: colors.white,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    }}>
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
          color: colors.gray500,
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: `${colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <Sparkles size={36} style={{ color: colors.primary }} />
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '12px', 
            color: colors.gray700,
            fontWeight: '600'
          }}>
            Générez d'abord un projet
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: colors.gray500,
            lineHeight: '1.5'
          }}>
            L'assistant IA sera disponible après la génération de votre projet
          </p>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: colors.white,
            margin: '16px',
            borderRadius: '8px'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: colors.gray600,
                padding: '40px 20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: `${colors.primary}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <MessageCircle size={24} style={{ color: colors.primary }} />
                </div>
                <h4 style={{ 
                  fontSize: '18px', 
                  marginBottom: '12px',
                  color: colors.gray700,
                  fontWeight: '600'
                }}>
                  👋 Bonjour ! Je suis votre assistant IA.
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  marginBottom: '24px',
                  color: colors.gray600,
                  lineHeight: '1.5'
                }}>
                  Décrivez-moi les modifications que vous souhaitez apporter à votre projet :
                </p>
                
                {/* Animated Quick Suggestions */}
                <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                  <p style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    marginBottom: '12px', 
                    color: colors.gray600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    💡 Suggestions rapides :
                  </p>
                  <div style={{
                    height: '200px', // Fixed height for 3 suggestions
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '12px',
                    border: `1px solid ${colors.gray200}`,
                    backgroundColor: `${colors.primary}03`
                  }}>
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        transform: `translateY(-${(currentSuggestionIndex % quickSuggestions.length) * 64}px)`,
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        gap: '8px',
                        padding: '8px'
                      }}
                    >
                      {/* Render all suggestions in a continuous loop */}
                      {[...quickSuggestions, ...quickSuggestions.slice(0, 3)].map((suggestion, index) => (
                        <button
                          key={`${suggestion}-${index}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            height: '56px', // Fixed height
                            padding: '12px 16px',
                            backgroundColor: colors.white,
                            border: `1px solid ${colors.gray300}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                            transition: 'all 0.3s ease',
                            color: colors.gray700,
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${colors.primary}08`;
                            e.target.style.borderColor = colors.primary;
                            e.target.style.transform = 'translateX(4px) scale(1.02)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255, 121, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.white;
                            e.target.style.borderColor = colors.gray300;
                            e.target.style.transform = 'translateX(0) scale(1)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    
                    {/* Gradient overlays for smooth fade effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '20px',
                      background: `linear-gradient(to bottom, ${colors.primary}03, transparent)`,
                      pointerEvents: 'none',
                      zIndex: 1
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '20px',
                      background: `linear-gradient(to top, ${colors.primary}03, transparent)`,
                      pointerEvents: 'none',
                      zIndex: 1
                    }} />
                  </div>
                  
                  {/* Animated dots indicator */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '16px'
                  }}>
                    {quickSuggestions.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: index === currentSuggestionIndex % quickSuggestions.length ? colors.primary : colors.gray300,
                          transition: 'all 0.3s ease',
                          transform: index === currentSuggestionIndex % quickSuggestions.length ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
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
                    maxWidth: '75%',
                    padding: '14px 18px',
                    borderRadius: message.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    backgroundColor: message.role === 'user' ? colors.primary : colors.white,
                    color: message.role === 'user' ? colors.white : colors.gray700,
                    border: message.role === 'assistant' ? `1px solid ${colors.gray300}` : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    position: 'relative'
                  }}>
                    {message.content}
                    {message.role === 'user' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        right: '16px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: colors.primary,
                        transform: 'rotate(45deg)',
                        borderRadius: '0 0 2px 0'
                      }} />
                    )}
                    {message.role === 'assistant' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '16px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: colors.white,
                        border: `1px solid ${colors.gray300}`,
                        borderTop: 'none',
                        borderRight: 'none',
                        transform: 'rotate(45deg)',
                        borderRadius: '0 0 2px 0'
                      }} />
                    )}
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
                  padding: '14px 18px',
                  borderRadius: '20px 20px 20px 6px',
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray300}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${colors.gray300}`,
                    borderTop: `2px solid ${colors.primary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ 
                    fontSize: '14px', 
                    color: colors.gray600,
                    fontWeight: '500'
                  }}>
                    L'assistant Orange travaille sur votre demande...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px 20px 20px',
            borderTop: `1px solid ${colors.gray200}`,
            backgroundColor: colors.white
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Décrivez la modification souhaitée... (Entrée pour envoyer)"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '50px',
                    borderRadius: '24px',
                    border: `2px solid ${colors.gray300}`,
                    fontSize: '14px',
                    resize: 'none',
                    minHeight: '48px',
                    maxHeight: '120px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: colors.white,
                    color: colors.gray700,
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.gray300;
                  }}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: inputMessage.trim() && !isLoading ? colors.primary : colors.gray300,
                  color: inputMessage.trim() && !isLoading ? colors.white : colors.gray500,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: inputMessage.trim() && !isLoading ? '0 4px 12px rgba(255, 121, 0, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim() && !isLoading) {
                    e.target.style.backgroundColor = colors.primaryHover;
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (inputMessage.trim() && !isLoading) {
                    e.target.style.backgroundColor = colors.primary;
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {isLoading ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Card>
  );
};