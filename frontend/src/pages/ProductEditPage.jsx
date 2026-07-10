import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../utils/imageUrl';
import './ProductEditPage.css';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    discount: 0,
    status: 'active',
    specifications: {},
    imageLinks: ''
  });

  useEffect(() => {
    fetchProductAndCategories();
  }, [id]);

  const fetchProductAndCategories = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        productAPI.getOne(id),
        categoryAPI.getAll()
      ]);

      const product = productRes.data.data;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || '',
        stock: product.stock || '',
        discount: product.discount || 0,
        status: product.status || 'active',
        specifications: product.specifications || {},
        imageLinks: (product.images || [])
          .map((image) => image?.url)
          .filter(Boolean)
          .join('\n')
      });

      setCategories(categoriesRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load product';
      toast.error(errorMsg);
      navigate('/admin/dashboard');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parseImageLinks = (value) => {
    return value
      .split(/[\n,]/)
      .map((link) => link.trim())
      .filter(Boolean)
      .slice(0, 5);
  };

  const imageUrls = parseImageLinks(formData.imageLinks);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        specifications: formData.specifications,
        images: imageUrls.map((url) => ({ url, public_id: null }))
      };

      await productAPI.update(id, submitData);
      toast.success('Product updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.error || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="product-edit-page">
      <div className="product-edit-container">
        <div className="edit-header">
          <h1>Edit Product</h1>
          <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-edit-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Enter product description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            {imageUrls.length > 0 && (
              <div className="existing-images">
                <h3>Current Images</h3>
                <div className="image-grid">
                  {imageUrls.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={resolveImageUrl(img)} alt={`Product ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="imageLinks">Image Links</label>
              <textarea
                id="imageLinks"
                name="imageLinks"
                value={formData.imageLinks}
                onChange={handleInputChange}
                rows="4"
                placeholder="https://example.com/image-1.jpg&#10;https://example.com/image-2.jpg"
              />
              <small className="form-hint">Paste up to 5 image URLs, one per line or separated by commas.</small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/admin/dashboard')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
