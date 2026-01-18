
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { HeartIcon } from '../components/icons';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="container">
          <HeartIcon className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love</p>
          <Link to="/products" className="btn btn-primary btn-large">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>My Wishlist ({wishlist.length} items)</h1>
        <div className="products-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

