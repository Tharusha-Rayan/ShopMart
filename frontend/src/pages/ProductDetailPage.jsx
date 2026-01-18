
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, reviewAPI, messageAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProductCard from '../components/product/ProductCard';
import { FiHeart, FiStar, FiShoppingCart, FiTruck, FiShield, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getOne(id);
      setProduct(data.data);
      if (data.data.category) {
        fetchSimilarProducts(data.data.category._id || data.data.category);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await reviewAPI.getProductReviews(id);
      setReviews(data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchSimilarProducts = async (categoryId) => {
    try {
      const { data } = await productAPI.getAll({ category: categoryId, limit: 4 });
      const filtered = data.data.filter(p => p._id !== id);
      setSimilarProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await reviewAPI.create({ ...reviewForm, product: id });
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
      fetchReviews();
      fetchProduct();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!product) return <div className="container"><p>Product not found</p></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images[selectedImage]?.url || `https://source.unsplash.com/800x800/?${encodeURIComponent(product.category?.name || 'product')},${encodeURIComponent(product.name?.split(' ')[0] || 'shopping')}`} 
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop';
                }}
              />
              <button 
                className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <FiHeart />
              </button>
            </div>
            <div className="image-thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${product.name} ${idx + 1}`}
                  className={selectedImage === idx ? 'active' : ''}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < Math.floor(product.rating) ? 'filled' : ''} />
                ))}
              </div>
              <span className="rating-text">
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            <div className="product-price-section">
              {product.discount > 0 && (
                <span className="original-price">${product.price.toFixed(2)}</span>
              )}
              <span className="current-price">
                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="discount-badge">{product.discount}% OFF</span>
              )}
            </div>

            <p className="product-description-short">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="color-selector">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            <div className="product-actions">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingCart /> Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {user && user.role === 'buyer' && product.seller && (
              <div className="seller-contact">
                <Button
                  variant="outline"
                  size="large"
                  onClick={async () => {
                    try {
                      await messageAPI.createConversation({
                        seller: product.seller._id || product.seller,
                        product: product._id
                      });
                      toast.success('Conversation started!');
                      navigate('/messages');
                    } catch (error) {
                      toast.error('Failed to start conversation');
                    }
                  }}
                >
                  <FiMessageSquare /> Contact Seller
                </Button>
              </div>
            )}

            <div className="product-features">
              <div className="feature">
                <FiTruck />
                <span>Fast shipping nationwide</span>
              </div>
              <div className="feature">
                <FiShield />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <div className="tab-headers">
            <button
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={activeTab === 'seller' ? 'active' : ''}
              onClick={() => setActiveTab('seller')}
            >
              Seller Info
            </button>
            <button
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="seller-tab">
                <Card className="seller-info-card">
                  <h3>About the Seller</h3>
                  <div className="seller-details">
                    <h4>{product.seller?.shopName || product.seller?.name || 'ShopMart Seller'}</h4>
                    <p className="seller-email">{product.seller?.email}</p>
                    <div className="seller-stats">
                      <div className="stat">
                        <strong>{product.seller?.totalProducts || 0}</strong>
                        <span>Products</span>
                      </div>
                      <div className="stat">
                        <strong>{product.seller?.rating || 4.5}</strong>
                        <span>Rating</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {similarProducts.length > 0 && (
                  <div className="similar-products-section">
                    <h3>Similar Products</h3>
                    <div className="similar-products-grid">
                      {similarProducts.map((similarProduct) => (
                        <ProductCard key={similarProduct._id} product={similarProduct} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                {user && (
                  <Card>
                    <h3>Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="rating-selector">
                        <label>Your Rating:</label>
                        <div className="stars-input">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={star <= reviewForm.rating ? 'filled' : ''}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            />
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      />
                      <Button type="submit" variant="primary">Submit Review</Button>
                    </form>
                  </Card>
                )}

                <div className="reviews-list">
                  {reviews.map((review) => (
                    <Card key={review._id} className="review-card">
                      <div className="review-header">
                        <strong>{review.user?.name}</strong>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                          ))}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
