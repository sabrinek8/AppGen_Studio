export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    };

    const sizeStyles = {
      small: { padding: '8px 16px', fontSize: '14px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 40px', fontSize: '18px', minWidth: '200px' }
    };

    const variantStyles = {
      primary: {
        background: disabled 
          ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      },
      secondary: {
        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        color: 'white'
      },
      success: {
        background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
        color: 'white'
      },
      danger: {
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={getButtonStyles()}
      {...props}
    >
      {children}
    </button>
  );
};