import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Trash2, ShoppingCart, Star } from 'lucide-react';
import './WishlistCard.css';

const WishlistCard = ({ product }) => {
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      await removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const discount = product.discount || 0;
  const finalPrice = product.price * (1 - discount / 100);

  return (
    <div className="wishlist-card-horizontal">
      <Link to={`/product/${product._id}`} className="wishlist-card-image">
        <img 
          src={
            product.images?.[0]?.url || 
            product.images?.[0] || 
            `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop`
          } 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
          }}
        />
        {discount > 0 && (
          <div className="wishlist-discount-badge">-{discount}%</div>
        )}
      </Link>

      <div className="wishlist-card-details">
        <Link to={`/product/${product._id}`}>
          <h3 className="wishlist-product-name">{product.name}</h3>
        </Link>

        {product.description && (
          <p className="wishlist-description">
            {product.description.length > 120 
              ? `${product.description.substring(0, 120)}...` 
              : product.description}
          </p>
        )}

        <div className="wishlist-rating">
          {[...Array(5)].map((_, i) => {
            const rating = product.rating || 0;
            const wholeStars = Math.round(rating);
            
            if (i < wholeStars) {
              return (
                <Star 
                  key={i} 
                  size={14} 
                  fill="#fbbf24"
                  color="#fbbf24"
                />
              );
            } else {
              return (
                <Star 
                  key={i} 
                  size={14} 
                  color="#d1d5db"
                />
              );
            }
          })}
          {product.numReviews > 0 && (
            <span className="wishlist-reviews">({product.numReviews} reviews)</span>
          )}
        </div>

        <div className="wishlist-meta">
          {product.category && (
            <span className="wishlist-category">{product.category.name || product.category}</span>
          )}
          {product.stock !== undefined && (
            <span className={`wishlist-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          )}
        </div>
      </div>

      <div className="wishlist-card-actions">
        <div className="wishlist-pricing">
          <div className="wishlist-price">${finalPrice.toFixed(2)}</div>
          {discount > 0 && (
            <div className="wishlist-original-price">${product.price.toFixed(2)}</div>
          )}
        </div>

        <button 
          className="wishlist-add-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        <button 
          className="wishlist-remove-btn"
          onClick={handleRemove}
        >
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
