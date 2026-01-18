import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { CartContext } from '../../../context/CartContext';
import { WishlistContext } from '../../../context/WishlistContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  BellIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  LogoutIcon,
  ShoppingBagIcon,
} from '../../icons';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <ShoppingBagIcon size={28} color="var(--color-primary)" />
          <span className="navbar__logo-text">SmartShop</span>
        </Link>

        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <div className="navbar__search-wrapper">
            <SearchIcon size={20} className="navbar__search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="navbar__nav">
          <Link to="/products" className="navbar__link">
            Products
          </Link>

          {user ? (
            <>
              {/* Wishlist */}
              <Link to="/wishlist" className="navbar__icon-link" title="Wishlist">
                <HeartIcon size={24} />
                {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="navbar__icon-link" title="Shopping Cart">
                <ShoppingCartIcon size={24} />
                {cartItemsCount > 0 && <span className="navbar__badge">{cartItemsCount}</span>}
              </Link>

              {/* Notifications */}
              <Link to="/notifications" className="navbar__icon-link" title="Notifications">
                <BellIcon size={24} />
              </Link>

              {/* User Menu */}
              <div className="navbar__user-menu">
                <button className="navbar__user-button" title="Account">
                  <UserIcon size={24} />
                </button>
                <div className="navbar__user-dropdown">
                  <div className="navbar__user-info">
                    <p className="navbar__user-name">{user.name}</p>
                    <p className="navbar__user-email">{user.email}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link to="/profile" className="navbar__dropdown-item" onClick={closeMenu}>
                    <UserIcon size={18} />
                    Profile
                  </Link>
                  <Link to="/orders" className="navbar__dropdown-item" onClick={closeMenu}>
                    <ShoppingBagIcon size={18} />
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="navbar__dropdown-item"
                      onClick={closeMenu}
                    >
                      <ShoppingBagIcon size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      className="navbar__dropdown-item"
                      onClick={closeMenu}
                    >
                      <ShoppingBagIcon size={18} />
                      Seller Dashboard
                    </Link>
                  )}
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item" onClick={handleLogout}>
                    <LogoutIcon size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">
                Login
              </Link>
              <Link to="/register" className="navbar__btn">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="navbar__mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar__mobile-menu">
          <form className="navbar__mobile-search" onSubmit={handleSearch}>
            <div className="navbar__search-wrapper">
              <SearchIcon size={20} className="navbar__search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="navbar__search-input"
              />
            </div>
          </form>

          <Link to="/products" className="navbar__mobile-link" onClick={closeMenu}>
            Products
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" className="navbar__mobile-link" onClick={closeMenu}>
                <HeartIcon size={20} />
                Wishlist
                {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="navbar__mobile-link" onClick={closeMenu}>
                <ShoppingCartIcon size={20} />
                Cart
                {cartItemsCount > 0 && <span className="navbar__badge">{cartItemsCount}</span>}
              </Link>
              <Link to="/notifications" className="navbar__mobile-link" onClick={closeMenu}>
                <BellIcon size={20} />
                Notifications
              </Link>
              <Link to="/profile" className="navbar__mobile-link" onClick={closeMenu}>
                <UserIcon size={20} />
                Profile
              </Link>
              <Link to="/orders" className="navbar__mobile-link" onClick={closeMenu}>
                <ShoppingBagIcon size={20} />
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="navbar__mobile-link" onClick={closeMenu}>
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'seller' && (
                <Link to="/seller/dashboard" className="navbar__mobile-link" onClick={closeMenu}>
                  Seller Dashboard
                </Link>
              )}
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
                <LogoutIcon size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="navbar__mobile-link" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
