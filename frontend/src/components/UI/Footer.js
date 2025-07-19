import React from 'react';

export const Footer = () => (
  <footer className="footer navbar" data-bs-theme="dark">
    <div className="container-xxl footer-social">
      <h3 className="footer-heading me-md-3">Suivez-nous</h3>
      <ul className="navbar-nav gap-2 flex-row align-self-start">
        <li>
          <a href="#" className="btn btn-icon btn-social btn-twitter">
            <span className="visually-hidden">Twitter</span>
          </a>
        </li>
        <li>
          <a href="#" className="btn btn-icon btn-social btn-facebook">
            <span className="visually-hidden">Facebook</span>
          </a>
        </li>
        <li>
          <a href="#" className="btn btn-icon btn-social btn-instagram">
            <span className="visually-hidden">Instagram</span>
          </a>
        </li>
        <li>
          <a href="#" className="btn btn-icon btn-social btn-whatsapp">
            <span className="visually-hidden">WhatsApp</span>
          </a>
        </li>
        <li>
          <a href="#" className="btn btn-icon btn-social btn-linkedin">
            <span className="visually-hidden">LinkedIn</span>
          </a>
        </li>
        <li>
          <a href="#" className="btn btn-icon btn-social btn-youtube">
            <span className="visually-hidden">YouTube</span>
          </a>
        </li>
      </ul>
    </div>
    <div className="container-xxl footer-terms">
    <ul className="navbar-nav gap-md-3">
      <li className="fw-bold">© Orange 2025</li>
      <li><a className="nav-link" href="#">Conditions générales</a></li>
      <li><a className="nav-link" href="#">Confidentialité</a></li>
      <li><a className="nav-link" href="#">Déclaration d'accessibilité</a></li>
      <li><a className="nav-link" href="#">Politique de cookies</a></li>
    </ul>
  </div>
  </footer>
);


