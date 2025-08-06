export const ManagementCard = ({ icon, title, subtitle, action, actionLabel, variant = 'primary' }) => {
  const getButtonClass = () => {
    const variants = {
      primary: 'btn btn-primary',
      secondary: 'btn btn-secondary',
      info: 'btn btn-info',
      success: 'btn btn-success',
      danger: 'btn btn-danger',
      warning:'btn btn-warning'
    };
    return variants[variant] || variants.secondary;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '20px',
      width: '400px',
      height: '140px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'white',
          border: '2px solid black',
          borderRadius: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '20px',
          fontSize: '24px'
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50',
            lineHeight: '1.2'
          }}>
            {title}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            color: '#7f8c8d',
            fontSize: '13px',
            lineHeight: '1.3'
          }}>
            {subtitle}
          </p>
        </div>
      </div>
      
      {/* Show button if action exists */}
      {action && actionLabel && (
        <button
          type="button"
          className={getButtonClass()}
          onClick={action}
          style={{
            width: '100%',
            marginTop: '12px'
          }}
        >
          {actionLabel}
        </button>
      )}
      
      {/* Show disabled button if no action but label exists */}
      {!action && actionLabel && (
        <button
          type="button"
          className="btn btn-secondary"
          disabled
          style={{
            width: '100%',
            marginTop: '12px',
            opacity: 0.5,
            cursor: 'not-allowed'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};