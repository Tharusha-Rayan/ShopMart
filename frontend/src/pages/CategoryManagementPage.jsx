import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { Pencil, Trash2, FolderPlus, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CategoryManagementPage.css';

const emptyForm = {
  name: '',
  description: '',
  parentCategory: '',
  isActive: true
};

const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Only admin can manage categories');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoryAPI.getAll();
      setCategories(data.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive
      };

      if (formData.parentCategory) {
        payload.parentCategory = formData.parentCategory;
      }

      if (editingId) {
        await categoryAPI.update(editingId, payload);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(payload);
        toast.success('Category created successfully');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save category');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      parentCategory: category.parentCategory?._id || '',
      isActive: category.isActive !== false
    });
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await categoryAPI.delete(categoryId);
      toast.success('Category deleted successfully');
      if (editingId === categoryId) {
        resetForm();
      }
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  const parentOptions = useMemo(() => categories.filter((category) => category._id !== editingId), [categories, editingId]);

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="category-management-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Manage Categories</h1>
            <p>Create, edit, and remove product categories</p>
          </div>
          <div className="header-actions">
            <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Button>
            <Button variant="primary" onClick={fetchCategories}>
              <RefreshCw size={16} /> Refresh
            </Button>
          </div>
        </div>

        <div className="category-layout">
          <Card className="category-form-card">
            <div className="section-head">
              <h2><FolderPlus size={20} /> {editingId ? 'Edit Category' : 'Add Category'}</h2>
              {editingId && (
                <button className="text-button" onClick={resetForm}>Cancel edit</button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Accessories"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description for the category"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="parentCategory">Parent Category</label>
                  <select id="parentCategory" name="parentCategory" value={formData.parentCategory} onChange={handleChange}>
                    <option value="">None</option>
                    {parentOptions.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="isActive">Active</label>
                  <div className="checkbox-wrap">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <span>Visible in store</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={resetForm} disabled={submitting}>
                  Reset
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="category-list-card">
            <div className="section-head">
              <h2>Existing Categories</h2>
              <span className="count-pill">{categories.length}</span>
            </div>

            {categories.length > 0 ? (
              <div className="table-responsive">
                <table className="categories-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Parent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td className="category-name-cell">{category.name}</td>
                        <td>{category.description || '—'}</td>
                        <td>
                          <span className={`status-badge ${category.isActive ? 'active' : 'banned'}`}>
                            {category.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td>{category.parentCategory?.name || 'None'}</td>
                        <td className="action-cell">
                          <button className="icon-btn edit" onClick={() => handleEdit(category)} title="Edit category">
                            <Pencil size={16} />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDelete(category._id)} title="Delete category">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No categories found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
