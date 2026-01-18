import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About ShopMart</h3>
          <p>Your one-stop destination for quality products at unbeatable prices.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/products">All Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/help">Help Center</Link>
        </div>
        
        <div className="footer-section">
          <h3>Customer Service</h3>
          <Link to="/help">Help Center</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping-info">Shipping Info</Link>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
