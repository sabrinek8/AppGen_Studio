import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

export const Header = ({ activeSection, onNavigate }) => {
  const { currentLanguage, changeLanguage, t, availableLanguages } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', label: 'English version', lang: 'en' },
    { code: 'FR', label: 'Version française', lang: 'fr' },
    { code: 'ES', label: 'Versión en español', lang: 'es' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsMenuOpen(false); // Close mobile menu when language changes
  };

  return (
    <header data-bs-theme="dark">
      {/* Supra bar - visible on larger screens */}
      <nav className="navbar navbar-expand-lg supra d-none d-lg-flex" aria-label="Supra navigation">
        <div className="container-xxl">
          <ul className="navbar-nav me-auto">{/* Left side empty for now */}</ul>
          <ul className="navbar-nav">
            {languages.map((lang) => (
              <li className="nav-item" key={lang.code}>
                <a
                  className={`nav-link ${currentLanguage === lang.code ? 'active' : ''}`}
                  href="#"
                  aria-label={`${lang.code} ${lang.label}`}
                  lang={lang.lang}
                  hreflang={lang.lang}
                  aria-current={currentLanguage === lang.code ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLanguageChange(lang.code);
                  }}
                >
                  {lang.code}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Global header */}
      <nav className="navbar navbar-expand-lg" aria-label="Global navigation - React AI Generator">
        <div className="container-xxl">
          {/* Brand */}
          <div className="navbar-brand me-auto me-lg-4">
            <a className="stretched-link" href="#">
              <img
                src="https://boosted.orange.com/docs/5.3/assets/brand/orange-logo.svg"
                width="50"
                height="50"
                alt="React AI Generator - Back to Home"
                loading="lazy"
              />
            </a>
            <h1 className="title">AppGen Studio</h1>
          </div>

          {/* Burger menu for mobile */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible navbar */}
          <div className={`navbar-collapse ${isMenuOpen ? 'show' : 'collapse'} me-lg-auto`}>
            {/* Mobile language options */}
            <ul className="navbar-nav border-top border-1 border-dark d-flex flex-row d-lg-none supra">
              {languages.map((lang) => (
                <li className="nav-item" key={`mobile-${lang.code}`}>
                  <a
                    className={`nav-link ${currentLanguage === lang.code ? 'active' : ''}`}
                    href="#"
                    aria-label={`${lang.code} ${lang.label}`}
                    lang={lang.lang}
                    hreflang={lang.lang}
                    aria-current={currentLanguage === lang.code ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange(lang.code);
                    }}
                  >
                    {lang.code}
                  </a>
                </li>
              ))}
            </ul>

            {/* Main navigation */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'generator' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('generator');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('generator')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'preview' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('preview');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('preview')}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeSection === 'manage' ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('manage');
                    setIsMenuOpen(false);
                  }}
                >
                  {t('manage')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
