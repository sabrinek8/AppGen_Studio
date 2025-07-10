import React from 'react';

export const Header = ({ activeSection, onNavigate }) => (
  <header style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px 0'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{
        color: 'white',
        margin: 0,
        fontSize: '28px',
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        🚀 React AI Generator
      </h1>
      
      <nav style={{ display: 'flex', gap: '10px' }}>
        {['generator', 'preview', 'manage'].map((section) => (
          <button
            key={section}
            onClick={() => onNavigate(section)}
            style={{
              padding: '10px 20px',
              background: activeSection === section 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {section === 'generator' && '🤖 Générateur'}
            {section === 'preview' && '👁️ Aperçu'}
            {section === 'manage' && '⚙️ Gestion'}
          </button>
        ))}
      </nav>
    </div>
  </header>
);