import React from 'react';

export const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px'
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '20px',
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <div>
      <h2 style={{
        margin: 0,
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50'
      }}>
        {title}
      </h2>
      <p style={{
        margin: '5px 0 0 0',
        color: '#7f8c8d',
        fontSize: '16px'
      }}>
        {subtitle}
      </p>
    </div>
  </div>
);
