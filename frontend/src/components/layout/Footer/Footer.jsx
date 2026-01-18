import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
} from '../../icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Company Info */}
        <div className="footer__section">
          <div className="footer__brand">
            <ShoppingBagIcon size={32} color="var(--color-primary)" />
            <span className="footer__brand-text">SmartShop</span>
          </div>
          <p className="footer__description">
            Your trusted destination for quality products at great prices. Shop with confidence
            and enjoy fast, reliable delivery.
          </p>
          <div className="footer__contact">
            <div className="footer__contact-item">
              <MailIcon size={18} />
              <span>support@smartshop.com</span>
            </div>
            <div className="footer__contact-item">
              <PhoneIcon size={18} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="footer__contact-item">
              <MapPinIcon size={18} />
              <span>123 Commerce St, City, State 12345</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer__section">
          <h3 className="footer__title">Quick Links</h3>
          <ul className="footer__links">
            <li>
              <Link to="/" className="footer__link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer__link">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="footer__link">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="footer__link">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/orders" className="footer__link">
                Track Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer__section">
          <h3 className="footer__title">Customer Service</h3>
          <ul className="footer__links">
            <li>
              <Link to="/help" className="footer__link">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer__link">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/shipping-info" className="footer__link">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link to="/returns" className="footer__link">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link to="/faq" className="footer__link">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer__section">
          <h3 className="footer__title">Legal</h3>
          <ul className="footer__links">
            <li>
              <Link to="/privacy" className="footer__link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer__link">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="footer__link">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className="footer__link">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__container">
          <p className="footer__copyright">
            &copy; {currentYear} SmartShop. All rights reserved.
          </p>
          <p className="footer__made-with">
            Made with <HeartIcon size={16} color="var(--color-danger)" /> by SmartShop Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
