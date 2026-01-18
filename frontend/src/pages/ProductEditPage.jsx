import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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
    specifications: {}
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

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
      
      // Check if user is authorized to edit this product
      if (user.role === 'seller') {
        const sellerId = product.seller?._id || product.seller;
        const userId = user._id || user.id;
        if (sellerId && userId && sellerId.toString() !== userId.toString()) {
          toast.error('You are not authorized to edit this product');
          navigate('/seller/dashboard');
          return;
        }
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || '',
        stock: product.stock || '',
        discount: product.discount || 0,
        status: product.status || 'active',
        specifications: product.specifications || {}
      });

      setExistingImages(product.images || []);
      setCategories(categoriesRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load product';
      toast.error(errorMsg);
      navigate('/seller/dashboard');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length - imagesToRemove.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(files);
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'specifications') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append new images
      images.forEach(image => {
        submitData.append('images', image);
      });

      // Append existing images to keep
      submitData.append('existingImages', JSON.stringify(existingImages));

      await productAPI.update(id, submitData);
      toast.success('Product updated successfully!');
      navigate('/seller/dashboard');
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
          <button className="btn-secondary" onClick={() => navigate('/seller/dashboard')}>
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
            
            {existingImages.length > 0 && (
              <div className="existing-images">
                <h3>Current Images</h3>
                <div className="image-grid">
                  {existingImages.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={`http://localhost:5000${img}`} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveExistingImage(img)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="images">Add New Images</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              <small className="form-hint">
                You can upload up to 5 images total. Current: {existingImages.length + images.length - imagesToRemove.length}/5
              </small>
            </div>

            {images.length > 0 && (
              <div className="new-images-preview">
                <h3>New Images to Upload</h3>
                <div className="image-grid">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(img)} alt={`New ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/seller/dashboard')}
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
