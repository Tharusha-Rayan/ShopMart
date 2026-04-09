
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Eye, Trash2 } from 'lucide-react';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState({});

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setIsRemoving({ ...isRemoving, [productId]: true });
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving({ ...isRemoving, [productId]: false });
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Heart className="empty-icon" size={80} />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to see them here</p>
            <Link to="/products" className="btn btn-primary btn-large">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="header-content">
            <h1>My Wishlist</h1>
            <p className="wishlist-count">
              <Heart size={20} />
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
        
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id || product.id} className="wishlist-item">
              <div className="item-image">
                <img 
                  src={product.images?.[0] || '/api/placeholder/300/300'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/300';
                  }}
                />
                <div className="item-overlay">
                  <button 
                    className="overlay-btn view-btn"
                    onClick={() => handleViewProduct(product._id)}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{product.name}</h3>
                <p className="item-description">
                  {product.description?.substring(0, 100)}...
                </p>
                
                <div className="item-price">
                  {product.discountPrice ? (
                    <>
                      <span className="current-price">${product.discountPrice}</span>
                      <span className="original-price">${product.originalPrice}</span>
                      <span className="discount-badge">
                        {Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="current-price">${product.originalPrice}</span>
                  )}
                </div>
                
                <div className="item-actions">
                  <button 
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button 
                    className="btn btn-danger remove-btn"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={isRemoving[product._id]}
                  >
                    <Trash2 size={18} />
                    {isRemoving[product._id] ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

