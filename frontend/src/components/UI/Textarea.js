import React from 'react';

export const Textarea = ({ label, icon, id, ...props }) => (
  <div className="mb-3">
    {label && (
      <label htmlFor={id} className="form-label">
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {label}
      </label>
    )}
    <textarea
      className="form-control"
      id={id}
      {...props}
    />
  </div>
);