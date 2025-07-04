import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Tagline */}
        <div className="footer-left">
          <h2 className="logo-text">KD Clothing</h2>
          <p className="tagline">Wear your style. Customize your vibe.</p>
        </div>

        {/* Links */}
        <div className="footer-center">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Products</Link></li>
            <li><Link to="/customize">Customize</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="footer-right">
          <h4>Follow Us</h4>
          <div className="socials">
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-x-twitter"></i></a>
            <a href="#" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} KD Clothing. All rights reserved.</p>
      </div>
    </footer>
  );
}
