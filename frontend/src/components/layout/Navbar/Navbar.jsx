import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { CartContext } from '../../../context/CartContext';
import { WishlistContext } from '../../../context/WishlistContext';
import {
  ShoppingCart,
  Heart,
  User,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <ShoppingBag size={26} />
          <span className="navbar__logo-text">SmartShop</span>
        </Link>

        {/* Search */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <div className="navbar__search-wrapper">
            <Search size={18} className="navbar__search-icon" />
            <input
              className="navbar__search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Nav */}
        <div className="navbar__nav">
          <Link to="/products" className="navbar__link">Products</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="navbar__icon-link">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="navbar__badge">{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" className="navbar__icon-link">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="navbar__badge">{cartItemsCount}</span>
                )}
              </Link>

              <Link to="/notifications" className="navbar__icon-link">
                <Bell size={22} />
              </Link>

              <div className="navbar__user-menu">
                <button
                  className="navbar__user-button"
                  onClick={() => setIsUserMenuOpen(v => !v)}
                >
                  <User size={22} />
                </button>

                {isUserMenuOpen && (
                  <div className="navbar__user-dropdown">
                    <Link to="/profile" className="navbar__dropdown-item">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/orders" className="navbar__dropdown-item">
                      <ShoppingBag size={16} /> Orders
                    </Link>
                    <button className="navbar__dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/register" className="navbar__btn">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsMenuOpen(v => !v)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar__mobile-menu">
          <form onSubmit={handleSearch}>
            <div className="navbar__search-wrapper">
              <Search size={18} className="navbar__search-icon" />
              <input
                className="navbar__search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
