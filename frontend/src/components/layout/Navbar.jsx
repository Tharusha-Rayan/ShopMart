// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiShoppingCart, FiHeart, FiBell, FiUser, FiSearch, FiMenu, FiX, FiLayout, FiShoppingBag } from 'react-icons/fi';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { useNotification } from '../../context/NotificationContext';
// import './Navbar.css';

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const { getCartCount } = useCart();
//   const { getWishlistCount } = useWishlist();
//   const { unreadCount } = useNotification();
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${searchQuery}`);
//       // Keep the search query in the input field
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           <FiShoppingBag className="logo-icon" />
//           <span className="logo-text">ShopMart</span>
//         </Link>

//         <form className="navbar-search" onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="search-input"
//           />
//           <button type="submit" className="search-button">
//             <FiSearch />
//           </button>
//         </form>

//         <div className="navbar-actions">
//           <Link to="/wishlist" className="navbar-icon-btn">
//             <FiHeart />
//             {getWishlistCount() > 0 && (
//               <span className="badge badge-red">{getWishlistCount()}</span>
//             )}
//           </Link>

//           <Link to="/notifications" className="navbar-icon-btn">
//             <FiBell />
//             {unreadCount > 0 && (
//               <span className="badge badge-red">{unreadCount}</span>
//             )}
//           </Link>

//           <Link to="/cart" className="navbar-icon-btn">
//             <FiShoppingCart />
//             {getCartCount() > 0 && (
//               <span className="badge badge-orange">{getCartCount()}</span>
//             )}
//           </Link>

//           {user && (
//             <Link
//               to={
//                 user.role === 'seller' ? '/seller/dashboard' :
//                   user.role === 'admin' ? '/admin/dashboard' :
//                     '/buyer/dashboard'
//               }
//               className="navbar-icon-btn"
//               title="Dashboard"
//             >


//               <FiLayout />

//             </Link>
//           )}

//           {user ? (
//             <div className="navbar-user-menu">
//               <button
//                 className="navbar-icon-btn"
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//               >


//                 <div className='profileicon'>
//                   <span className="username">

//                     {user.name.split(' ')[0]} {/* first name only */}
//                     <FiUser />
//                   </span>
//                 </div>

//               </button>
//               {userDropdownOpen && (
//                 <div className="user-dropdown">
//                   <div className="user-dropdown-header">
//                     <p className="user-name">{user.name}</p>
//                     <p className="user-email">{user.email}</p>
//                   </div>
//                   <div className="user-dropdown-divider"></div>
//                   <Link
//                     to="/profile"
//                     className="user-dropdown-item"
//                     onClick={() => setUserDropdownOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     to="/orders"
//                     className="user-dropdown-item"
//                     onClick={() => setUserDropdownOpen(false)}
//                   >
//                     My Orders
//                   </Link>
//                   <div className="user-dropdown-divider"></div>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setUserDropdownOpen(false);
//                     }}
//                     className="user-dropdown-item logout-btn"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login" className="btn btn-primary btn-small">Login</Link>
//           )}

//           <button
//             className="navbar-mobile-toggle"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <FiX /> : <FiMenu />}
//           </button>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="navbar-mobile-menu">
//           <Link to="/products" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//             All Products
//           </Link>
//           <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//             Wishlist {getWishlistCount() > 0 && `(${getWishlistCount()})`}
//           </Link>
//           <Link to="/cart" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//             Cart {getCartCount() > 0 && `(${getCartCount()})`}
//           </Link>
//           {user ? (
//             <>
//               <Link to="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//                 Profile
//               </Link>
//               <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//                 My Orders
//               </Link>
//               <button
//                 onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
//                 className="mobile-menu-item logout-btn"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//                 Login
//               </Link>
//               <Link to="/register" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;















import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiBell, FiUser, FiSearch, FiMenu, FiX, FiLayout, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }

      const clickedInsideMobileMenu = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      const clickedMobileToggle = mobileToggleRef.current && mobileToggleRef.current.contains(event.target);

      if (!clickedInsideMobileMenu && !clickedMobileToggle) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <FiShoppingBag className="logo-icon" />
          <span className="logo-text">ShopMart</span>
        </Link>

        {/* Search bar */}
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

        {/* Desktop Icons */}
        <div className="navbar-actions">
          <Link to="/wishlist" className="navbar-icon-btn">
            <FiHeart />
            {getWishlistCount() > 0 && <span className="badge badge-red">{getWishlistCount()}</span>}
          </Link>

          <Link to="/notifications" className="navbar-icon-btn">
            <FiBell />
            {unreadCount > 0 && <span className="badge badge-red">{unreadCount}</span>}
          </Link>

          <Link to="/cart" className="navbar-icon-btn">
            <FiShoppingCart />
            {getCartCount() > 0 && <span className="badge badge-orange">{getCartCount()}</span>}
          </Link>

          {user && (
            <Link
              to={
                user.role === 'seller'
                  ? '/seller/dashboard'
                  : user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/buyer/dashboard'
              }
              className="navbar-icon-btn"
              title="Dashboard"
            >
              <FiLayout />
            </Link>
          )}

          {user ? (
            <div className="navbar-user-menu" ref={userMenuRef}>
              <button className="navbar-icon-btn" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
                <div className="profileicon">
                  <span className="username">
                    {user.name.split(' ')[0]} {/* first name */}
                    <FiUser />
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
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
            <Link to="/login" className="btn btn-primary btn-small">
              Login
            </Link>
          )}

        </div>

        {/* Mobile Hamburger */}
        <button
          ref={mobileToggleRef}
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu" ref={mobileMenuRef}>
          <Link to="/products" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </Link>
          <Link to="/wishlist" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            Wishlist {getWishlistCount() > 0 && `(${getWishlistCount()})`}
          </Link>
          <Link to="/cart" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            Cart {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>
          <Link to="/notifications" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Link>
          {user ? (
            <>
              <div className="mobile-avatar">
                <FiUser /> {user.name.split(' ')[0]}
              </div>
              <Link to="/profile" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
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
