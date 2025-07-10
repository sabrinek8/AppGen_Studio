import React from 'react';

export const ManagementCard = ({ icon, title, subtitle, action, actionLabel, variant = 'primary' }) => {
  const getIconBackground = () => {
    const variants = {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      info: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      success: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      danger: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    };
    return variants[variant] || variants.primary;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: getIconBackground(),
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '15px',
          fontSize: '20px'
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            {title}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            {subtitle}
          </p>
        </div>
      </div>
      
      {action && (
        <button
          onClick={action}
          style={{
            width: '100%',
            padding: '12px 0',
            background: getIconBackground(),
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};