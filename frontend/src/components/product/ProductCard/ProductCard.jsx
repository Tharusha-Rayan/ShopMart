import React from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';
import { HeartIcon, HeartFilledIcon, ShoppingCartIcon, StarIcon, StarFilledIcon } from '../../icons';
import Button from '../../common/Button';

/**
 * ProductCard Component
 * Displays product information in a card format
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Add to cart handler
 * @param {Function} props.onToggleWishlist - Toggle wishlist handler
 * @param {boolean} props.isInWishlist - Whether product is in wishlist
 * @param {Function} props.onClick - Card click handler
 */
const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  onClick,
}) => {
  const { name, price, originalPrice, discount, rating, reviews, images, stock } = product;
  
  const imageUrl = images && images[0] 
    ? `${process.env.REACT_APP_UPLOADS_URL}/${images[0]}`
    : 'https://via.placeholder.com/300';

  const handleAddToCart = e => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleWishlist = e => {
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarFilledIcon key={i} size={16} color="var(--color-warning)" />);
      } else {
        stars.push(<StarIcon key={i} size={16} color="var(--color-neutral-300)" />);
      }
    }
    return stars;
  };

  return (
    <div className="product-card" onClick={onClick}>
      {/* Product Image */}
      <div className="product-card__image-wrapper">
        <img src={imageUrl} alt={name} className="product-card__image" />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="product-card__badge product-card__badge--discount">
            -{discount}%
          </span>
        )}
        
        {/* Out of Stock Badge */}
        {stock === 0 && (
          <span className="product-card__badge product-card__badge--stock">
            Out of Stock
          </span>
        )}
        
        {/* Wishlist Button */}
        <button
          className="product-card__wishlist"
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? (
            <HeartFilledIcon size={20} color="var(--color-danger)" />
          ) : (
            <HeartIcon size={20} />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="product-card__content">
        <h3 className="product-card__title">{name}</h3>
        
        {/* Rating */}
        <div className="product-card__rating">
          <div className="product-card__stars">
            {renderStars(rating || 0)}
          </div>
          <span className="product-card__reviews">({reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="product-card__price-wrapper">
          <span className="product-card__price">${price}</span>
          {originalPrice && originalPrice > price && (
            <span className="product-card__original-price">${originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          icon={<ShoppingCartIcon size={18} />}
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    discount: PropTypes.number,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onToggleWishlist: PropTypes.func,
  isInWishlist: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ProductCard;
