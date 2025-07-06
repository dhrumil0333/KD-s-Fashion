import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../img/Logo.png';
import { useAuth } from '../context/AuthContext';
import profileIcon from '../img/profile.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); 
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false); 
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={logo} alt="Brand Logo" />
          </Link>
        </div>

        <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </div>

        <ul className={`nav-links ${isOpen ? 'show-nav' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/customize">3D Customize</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="navbar-right">
          <Link to="/cart" className="cart-icon" title="Cart"
            onClick={() => {
              if (!user) {
                alert('Please log in to view your cart.');
                return;


              }
            }}>

            🛒</Link>
          {
            user ? (
              <Link to="/profile" className="profile-icon" title="Profile">
                <img src={profileIcon} alt="Profile" style={{ width: '30px', height: '30px' }} />
              </Link>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )
          }
        </div>
      </div>
    </nav>
  );
}
