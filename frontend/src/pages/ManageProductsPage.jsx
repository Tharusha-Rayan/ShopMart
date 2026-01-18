import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { EditIcon, TrashIcon, EyeIcon } from '../components/icons';
import './ManageProductsPage.css';

const ManageProductsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getAll();
      setProducts(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productAPI.updateStatus(productId, { status: newStatus });
      toast.success(`Product ${newStatus === 'active' ? 'activated' : newStatus === 'inactive' ? 'deactivated' : 'banned'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
      console.error(error);
    }
  };

  const handleDiscountUpdate = async (productId, discount) => {
    try {
      await productAPI.update(productId, { discount: Number(discount) });
      toast.success('Discount updated successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update discount');
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    filter === 'all' ? true : p.status === filter
  );

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="manage-products-page">
      <div className="container">
        <div className="page-header">
          <h1>Manage Products</h1>
          <p>Control product status and discounts</p>
        </div>

        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({products.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Active ({products.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={filter === 'inactive' ? 'active' : ''} 
            onClick={() => setFilter('inactive')}
          >
            Inactive ({products.filter(p => p.status === 'inactive').length})
          </button>
          <button 
            className={filter === 'banned' ? 'active' : ''} 
            onClick={() => setFilter('banned')}
          >
            Banned ({products.filter(p => p.status === 'banned').length})
          </button>
        </div>

        <Card>
          {filteredProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Status</th>
                    {user?.role !== 'seller' && <th>Seller</th>}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product._id}>
                      <td className="product-cell">
                        <img 
                          src={product.images?.[0]?.url || `https://source.unsplash.com/100x100/?${encodeURIComponent(product.name?.split(' ')[0] || 'product')}`} 
                          alt={product.name} 
                          className="product-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                          }}
                        />
                        <span>{product.name}</span>
                      </td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={product.discount || 0}
                          onChange={(e) => handleDiscountUpdate(product._id, e.target.value)}
                          className="discount-input"
                        />
                        <span>%</span>
                      </td>
                      <td>
                        <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td>
                        <select
                          value={product.status}
                          onChange={(e) => handleStatusChange(product._id, e.target.value)}
                          className={`status-select status-${product.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="banned">Banned</option>
                        </select>
                      </td>
                      {user?.role !== 'seller' && <td>{product.seller?.name || 'N/A'}</td>}
                      <td className="action-cell">
                        <button 
                          className="icon-btn view" 
                          onClick={() => navigate(`/product/${product._id}`)}
                          title="View"
                        >
                          <EyeIcon />
                        </button>
                        <button 
                          className="icon-btn edit" 
                          onClick={() => navigate(`/product/${product._id}/edit`)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          className="icon-btn delete" 
                          onClick={() => handleDelete(product._id)}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageProductsPage;

