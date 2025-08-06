import React from 'react';

export const Header = ({ activeSection, onNavigate }) => (
  <header data-bs-theme="dark">
    <nav className="navbar navbar-expand-lg" aria-label="Global navigation - React AI Generator">
      <div className="container-xxl">
        {/* Orange brand logo */}
        <div className="navbar-brand me-auto me-lg-4">
          <a className="stretched-link" href="#">
            <img src="https://boosted.orange.com/docs/5.3/assets/brand/orange-logo.svg" width="50" height="50" alt="React AI Generator - Back to Home" loading="lazy" />
          </a>
          <h1 className="title">AppGen Studio</h1>
        </div>
        
        {/* Navbar with links */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a 
              className={`nav-link ${activeSection === 'generator' ? 'active' : ''}`} 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('generator');
              }}
            >
              Générateur
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${activeSection === 'preview' ? 'active' : ''}`} 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('preview');
              }}
            >
              Aperçu
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${activeSection === 'manage' ? 'active' : ''}`} 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('manage');
              }}
            >
              Gestion
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);