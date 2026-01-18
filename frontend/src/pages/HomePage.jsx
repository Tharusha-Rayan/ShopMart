
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import { StarIcon, TruckIcon, CreditCardIcon, MailIcon } from '../components/icons';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await productAPI.getFeatured();
      setFeaturedProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
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

      {/* Promotional Banners */}
      <section className="promo-banners">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card">
              <div className="promo-icon"><TruckIcon /></div>
              <h3>Fast Shipping</h3>
              <p>Quick delivery nationwide</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><StarIcon /></div>
              <h3>New Arrivals</h3>
              <p>Fresh products daily</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><CreditCardIcon /></div>
              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
            <div className="promo-card">
              <div className="promo-icon"><StarIcon /></div>
              <h3>Quality Products</h3>
              <p>Verified sellers only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2><MailIcon /> Subscribe to Our Newsletter</h2>
            <p>Get the latest deals and updates delivered to your inbox</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <Button variant="primary" type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

