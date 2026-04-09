
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productAPI, aiAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import './ProductListingPage.css';

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const search = searchParams.get('search');
      const params = {
        page,
        search,
        category: searchParams.get('category'),
        minPrice: searchParams.get('minPrice'),
        maxPrice: searchParams.get('maxPrice'),
        minRating: searchParams.get('minRating'),
        sort: searchParams.get('sort')
      };

      if (search && search.trim()) {
        const { data } = await aiAPI.semanticSearch({
          q: search,
          limit: 40,
          categoryId: searchParams.get('category') || undefined
        });

        setProducts(data.data || []);
        setTotal((data.data || []).length);
        setTotalPages(1);

        await aiAPI.logEvent({
          eventType: 'search',
          payload: { query: search },
          metadata: { page: '/products' }
        }).catch(() => null);
      } else {
        const { data } = await productAPI.getAll(params);
        setProducts(data.data);
        setTotal(data.total);
        setTotalPages(data.pages || Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams(searchParams);
    
    // Update or remove this filter parameter
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    setPage(1);
    
    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    const search = params.get('search'); // Keep search query
    
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: ''
    });
    
    if (search) {
      navigate(`/products?search=${search}`);
    } else {
      navigate('/products');
    }
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== false);

  return (
    <div className="product-listing-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>All Products</h1>
            {searchParams.get('search') && (
              <p className="search-query">Results for "{searchParams.get('search')}"</p>
            )}
          </div>
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Bar - Horizontal */}
        {showFilters && (
          <div className="filters-bar">
            <div className="filters-row">
              {/* Category Filter */}
              <div className="filter-item">
                <label className="filter-label">Category</label>
                <select
                  className="filter-select"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-item">
                <label className="filter-label">Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    className="price-input"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="price-input"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-item">
                <label className="filter-label">Min Rating</label>
                <select
                  className="filter-select"
                  value={filters.minRating}
                  onChange={(e) => updateFilter('minRating', e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4">★ 4+ Stars</option>
                  <option value="3">★ 3+ Stars</option>
                  <option value="2">★ 2+ Stars</option>
                  <option value="1">★ 1+ Stars</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="filter-item">
                <label className="filter-label">Sort By</label>
                <select
                  className="filter-select"
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="filter-item filter-clear-item">
                <button 
                  className="clear-filters-btn" 
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-layout">
          <main className="products-main">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <p className="results-count">
                  {total} product{total !== 1 ? 's' : ''} found
                  {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
                </p>
                
                {products.length === 0 ? (
                  <div className="no-products">
                    <p>No products found. Try adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="products-grid">
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 2 && pageNum <= page + 2)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-number ${page === pageNum ? 'active' : ''}`}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (pageNum === page - 3 || pageNum === page + 3) {
                          return <span key={pageNum} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
