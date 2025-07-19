import React from 'react';

export const Layout = ({ children }) => (
  <div className="bg-body" style={{
    minHeight: '100vh',
    fontFamily: '-apple-system, Helvetica Neue, "Segoe UI", Roboto, sans-serif'
  }}>
    {children}
  </div>
)