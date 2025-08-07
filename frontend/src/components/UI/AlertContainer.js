import React from 'react';
import { Alert } from './Alert';

/**
 * Container component for displaying multiple alerts
 * @param {Array} alerts - Array of alert objects
 * @param {function} onRemove - Function to remove an alert
 * @param {string} position - Container position: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 */
export const AlertContainer = ({ 
  alerts = [], 
  onRemove,
  position = 'top-right',
  className = '',
  style = {}
}) => {
  if (alerts.length === 0) return null;

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'position-fixed top-0 start-0';
      case 'bottom-right':
        return 'position-fixed bottom-0 end-0';
      case 'bottom-left':
        return 'position-fixed bottom-0 start-0';
      case 'top-right':
      default:
        return 'position-fixed top-0 end-0';
    }
  };

  const defaultStyle = {
    zIndex: 1055,
    maxWidth: '400px',
    ...style
  };

  return (
    <div 
      className={`alert-container ${getPositionClass()} p-3 ${className}`} 
      style={defaultStyle}
    >
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          dismissible={!!onRemove}
          onClose={() => onRemove?.(alert.id)}
          className="mb-2"
        />
      ))}
    </div>
  );
};