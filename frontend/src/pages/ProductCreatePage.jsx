import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI, productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../utils/imageUrl';
import './ProductCreatePage.css';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    profitPercentage: '0',
    category: '',
    stock: '',
    discount: '0',
    status: 'active',
    imageLinks: ''
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await categoryAPI.getAll();
        setCategories(data.data || []);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Only admin can add products');
      navigate('/');
    }
  }, [user, navigate]);

  const finalPrice = useMemo(() => {
    const base = Number(formData.basePrice || 0);
    const profit = Number(formData.profitPercentage || 0);
    if (Number.isNaN(base) || Number.isNaN(profit)) return 0;
    return Number((base * (1 + profit / 100)).toFixed(2));
  }, [formData.basePrice, formData.profitPercentage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const imageUrls = useMemo(() => parseImageLinks(formData.imageLinks), [formData.imageLinks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.stock || formData.basePrice === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock),
        discount: Number(formData.discount || 0),
        status: formData.status,
        basePrice: Number(formData.basePrice),
        profitPercentage: Number(formData.profitPercentage || 0),
        price: Number(finalPrice),
        specifications: {},
        images: imageUrls.map((url) => ({ url, public_id: null }))
      };

      await productAPI.create(submitData);
      toast.success('Product created successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-create-page">
      <div className="product-create-container">
        <div className="create-header">
          <h1>Add Product</h1>
          <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-create-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="5" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="basePrice">Base Price ($) *</label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profitPercentage">Profit Percentage (%)</label>
                <input
                  type="number"
                  id="profitPercentage"
                  name="profitPercentage"
                  value={formData.profitPercentage}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="final-price-card">
              <span>Final Price (auto-generated)</span>
              <strong>${finalPrice.toFixed(2)}</strong>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} min="0" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input type="number" id="discount" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            <div className="form-group">
              <label htmlFor="imageLinks">Image Links (optional)</label>
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

            {imageUrls.length > 0 && (
              <div className="new-images-preview">
                <h3>Image Preview</h3>
                <div className="image-grid">
                  {imageUrls.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={resolveImageUrl(img)} alt={`Preview ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/dashboard')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;
