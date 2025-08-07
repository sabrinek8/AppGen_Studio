import { useState, useCallback } from 'react';

/**
 * Custom hook for managing alerts
 * @returns {object} Alert management functions and state
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  /**
   * Add a new alert
   * @param {string} type - Alert type: 'success', 'danger', 'warning', 'info'
   * @param {string} message - Alert message
   * @param {number} duration - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
   * @returns {string} Alert ID
   */
  const addAlert = useCallback((type, message, duration = 5000) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert = { id, type, message };
    
    setAlerts(prev => [...prev, newAlert]);
    
    // Auto-dismiss after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
    
    return id;
  }, []);

  /**
   * Remove a specific alert
   * @param {string} id - Alert ID to remove
   */
  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  /**
   * Clear all alerts
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  /**
   * Convenience methods for different alert types
   */
  const showSuccess = useCallback((message, duration) => 
    addAlert('success', message, duration), [addAlert]);
  
  const showError = useCallback((message, duration) => 
    addAlert('danger', message, duration), [addAlert]);
  
  const showWarning = useCallback((message, duration) => 
    addAlert('warning', message, duration), [addAlert]);
  
  const showInfo = useCallback((message, duration) => 
    addAlert('info', message, duration), [addAlert]);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};