import React from 'react';

export const Textarea = ({ label, icon, ...props }) => (
  <div>
    {label && (
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#2c3e50',
        fontSize: '16px'
      }}>
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {label}
      </label>
    )}
    <textarea
      style={{
        width: '100%',
        padding: '16px',
        border: '2px solid #e9ecef',
        borderRadius: '12px',
        fontSize: '16px',
        resize: 'vertical',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s ease',
        outline: 'none'
      }}
      onFocus={(e) => e.target.style.borderColor = '#667eea'}
      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
      {...props}
    />
  </div>
);