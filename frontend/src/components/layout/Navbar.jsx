import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiBell, FiUser, FiSearch, FiMenu, FiX, FiLayout, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiShoppingBag className="logo-icon" />
          <span className="logo-text">ShopMart</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FiSearch />
          </button>
        </form>

        <div className="navbar-actions">
          <Link to="/wishlist" className="navbar-icon-btn">
            <FiHeart />
          </Link>

          <Link to="/notifications" className="navbar-icon-btn">
            <FiBell />
            {unreadCount > 0 && (
              <span className="badge badge-red">{unreadCount}</span>
            )}
          </Link>

          <Link to="/cart" className="navbar-icon-btn">
            <FiShoppingCart />
            {getCartCount() > 0 && (
              <span className="badge badge-orange">{getCartCount()}</span>
            )}
          </Link>

          {user && (
            <Link 
              to={
                user.role === 'seller' ? '/seller/dashboard' : 
                user.role === 'admin' ? '/admin/dashboard' : 
                '/buyer/dashboard'
              } 
              className="navbar-icon-btn"
              title="Dashboard"
            >
              <FiLayout />
            </Link>
          )}

          {user ? (
            <div className="navbar-user-menu">
              <button 
                className="navbar-icon-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <FiUser />
              </button>
              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <Link 
                    to="/profile" 
                    className="user-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="user-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <div className="user-dropdown-divider"></div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setUserDropdownOpen(false);
                    }} 
                    className="user-dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-small">Login</Link>
          )}

          <button 
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/products" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </Link>
          <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            Wishlist
          </Link>
          <Link to="/cart" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            Cart {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                className="mobile-menu-item logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
