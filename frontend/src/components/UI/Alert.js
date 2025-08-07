import React from 'react';

/**
 * Reusable Alert Component
 * @param {string} type - Alert type: 'success', 'danger', 'warning', 'info'
 * @param {string} message - Alert message to display
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {function} onClose - Optional close handler
 * @param {boolean} dismissible - Whether the alert can be dismissed
 */
export const Alert = ({ 
  type = 'info', 
  message, 
  className = '', 
  style = {}, 
  onClose,
  dismissible = false 
}) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'danger':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  const defaultStyle = {
    backgroundColor: 'white',
    ...style
  };

  const getIconLabel = () => {
    switch (type) {
      case 'success':
        return 'Succès';
      case 'danger':
        return 'Erreur';
      case 'warning':
        return 'Attention';
      case 'info':
      default:
        return 'Information';
    }
  };

  return (
    <div 
      className={`alert ${getAlertClass()} ${className} alert-heading`} 
      role="alert" 
      style={defaultStyle}
    >
      <span className="alert-icon">
        <span className="visually-hidden">{getIconLabel()}</span>
      </span>
      <span>{message}</span>
      {dismissible && onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
};