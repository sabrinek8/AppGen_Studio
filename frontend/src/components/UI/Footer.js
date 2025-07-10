import React from 'react';

export const Footer = () => (
  <footer style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px 0',
    marginTop: '50px'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📝 Guide d'utilisation
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          fontSize: '14px',
          color: 'rgb(255, 255, 255)'
        }}>
          <div>🤖 Utilisez l'IA pour générer des projets personnalisés</div>
          <div>👁️ Visualisez et éditez votre code en temps réel</div>
          <div>⚙️ Gérez vos projets avec import/export</div>
        </div>
      </div>
    </div>
  </footer>
);

