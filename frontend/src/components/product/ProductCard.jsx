import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const discount = product.discount || 0;
  const inWishlist = isInWishlist(product._id);
  
  // Clean product name by removing seller info in parentheses or after dash
  const cleanProductName = product.name
    ?.replace(/\s*\([^)]*\)\s*$/g, '') // Remove anything in parentheses at the end
    ?.replace(/\s*-\s*[^-]*$/g, '') // Remove anything after last dash
    ?.trim() || product.name;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {discount > 0 && (
        <div className="product-badge discount-badge">-{discount}%</div>
      )}
      
      <button 
        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
        onClick={handleWishlistToggle}
      >
        <FiHeart />
      </button>

      <div className="product-image-wrapper">
        <img 
          src={
            product.images?.[0]?.url || 
            product.images?.[0] || 
            (typeof product.images === 'string' ? product.images : null) ||
            `https://source.unsplash.com/400x400/?${encodeURIComponent(product.category?.name || 'product')},${encodeURIComponent(product.name?.split(' ')[0] || 'shopping')}`
          } 
          alt={product.name || 'Product'}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
          }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{cleanProductName}</h3>
        
        {product.description && (
          <p className="product-description-small">
            {product.description.length > 80 
              ? `${product.description.substring(0, 80)}...` 
              : product.description}
          </p>
        )}
        
        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.round(product.rating || 0))}</span>
          {product.numReviews > 0 && (
            <span className="rating-count">({product.numReviews})</span>
          )}
        </div>

        <div className="product-pricing">
          <span className="product-price">${product.price}</span>
          {product.originalPrice && (
            <span className="product-original-price">${product.originalPrice}</span>
          )}
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <FiShoppingCart />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
