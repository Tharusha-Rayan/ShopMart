
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, aiAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import { Star, Truck, CreditCard, Mail } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const [featuredRes, recommendationRes] = await Promise.all([
        productAPI.getFeatured(),
        aiAPI.getRecommendations({ limit: 8 }).catch(() => ({ data: { data: [] } }))
      ]);

      setFeaturedProducts(featuredRes.data.data || []);
      setRecommendedProducts(recommendationRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = async (product) => {
    try {
      await aiAPI.logEvent({
        eventType: 'product_view',
        payload: {
          productId: product._id,
          price: product.price
        },
        metadata: {
          page: '/',
          placement: 'home_recommendations'
        }
      });
    } catch (error) {
      console.error('Failed to log recommendation click:', error);
    }
  };

  return (
    <div className="homepage">
    
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Shop Smart, Save Big</h1>
          <p className="hero-subtitle">Thousands of products, millions of smiles</p>
          <div className="hero-actions">
            <Link to="/products">
              <Button variant="primary" size="large">Start Shopping</Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
            alt="Shopping"
            className="hero-img"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Top Products</h2>
            <p className="section-subtitle">Best sellers, highly rated & most searched</p>
            <Link to="/products">
              <Button variant="primary">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Recommended For You</h2>
            <p className="section-subtitle">Personalized picks based on shopping behavior</p>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="products-grid">
              {(recommendedProducts.length ? recommendedProducts : featuredProducts.slice(0, 8)).map(product => (
                <ProductCard
                  key={`rec-${product._id}`}
                  product={product}
                  onProductClick={handleRecommendationClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="promo-banners">
        <div className="container">
          <div className="promo-grid">
            {/* <div className="promo-card">
              <div className="promo-icon"><Truck /></div>
              <h3>Fast Shipping</h3>
              <p>Quick delivery nationwide</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><Star /></div>
              <h3>New Arrivals</h3>
              <p>Fresh products daily</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><CreditCard /></div>
              <h3>Cash On Delivery</h3>
              <p>Pay when you receive your order</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><Star /></div>
              <h3>Quality Products</h3>
              <p>Verified sellers only</p>
            </div> */}






            <div className="promo-card">
              <div className="promo-icon">
                <Truck />
              </div>
              <h3>Fast Shipping</h3>
              <p>Quick delivery nationwide</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">
                <Star />
              </div>
              <h3>New Arrivals</h3>
              <p>Fresh products daily</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">
                <CreditCard />
              </div>
              <h3>Cash On Delivery</h3>
              <p>Pay when you receive your order</p>
            </div>

            <div className="promo-card">
              <div className="promo-icon">
                <Star />
              </div>
              <h3>Quality Products</h3>
              <p>Verified sellers only</p>
            </div>






          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


