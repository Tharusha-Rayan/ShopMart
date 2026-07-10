
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Eye, Trash2 } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState({});

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id || product.id, 1);
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
    navigate(`/product/${productId}`);
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
          {wishlist.map((product) => {
            const productId = product._id || product.id;
            const basePrice = Number(product.price ?? product.originalPrice ?? 0);
            const discount = Number(product.discount ?? 0);
            const fallbackDiscountPrice = discount > 0 ? Number((basePrice * (1 - discount / 100)).toFixed(2)) : basePrice;
            const currentPrice = Number(product.discountPrice ?? fallbackDiscountPrice);
            const originalPrice = Number(product.originalPrice ?? basePrice);
            const hasDiscount = originalPrice > currentPrice;
            const discountPercent = hasDiscount && originalPrice > 0
              ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
              : 0;

            return (
            <div key={productId} className="wishlist-item">
              <div className="item-image">
                  {resolveImageUrl(product.images?.[0]?.url || product.images?.[0]) ? (
                    <img 
                      src={resolveImageUrl(product.images?.[0]?.url || product.images?.[0])} 
                      alt={product.name}
                    />
                  ) : (
                    <div className="wishlist-image-empty">No image available</div>
                  )}
                <div className="item-overlay">
                  <button 
                    className="overlay-btn view-btn"
                    onClick={() => handleViewProduct(productId)}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{product.name}</h3>
                <p className="item-description">
                  {product.description ? `${product.description.substring(0, 100)}...` : 'No description available'}
                </p>

                <p className="item-meta">
                  Stock: {typeof product.stock === 'number' ? product.stock : 'N/A'}
                </p>
                
                <div className="item-price">
                  {hasDiscount ? (
                    <>
                      <span className="current-price">${currentPrice.toFixed(2)}</span>
                      <span className="original-price">${originalPrice.toFixed(2)}</span>
                      <span className="discount-badge">
                        {discountPercent}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="current-price">${currentPrice.toFixed(2)}</span>
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
                    onClick={() => handleRemoveFromWishlist(productId)}
                    disabled={isRemoving[productId]}
                  >
                    <Trash2 size={18} />
                    {isRemoving[productId] ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

