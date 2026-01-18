
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerAPI, productAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';
import { DollarSignIcon, PackageIcon, ShoppingBagIcon, TrendingUpIcon, PlusIcon, EditIcon, TrashIcon, EyeIcon, MessageSquareIcon, RefreshIcon, BarChartIcon, SettingsIcon, CheckCircleIcon, TruckIcon, CloseIcon } from '../components/icons';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    discount: '0'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        sellerAPI.getStats().catch(() => ({ data: { data: { totalRevenue: 0, totalProducts: 0, totalOrders: 0, pendingOrders: 0 } } })),
        sellerAPI.getProducts().catch(() => ({ data: { data: [] } })),
        sellerAPI.getOrders().catch(() => ({ data: { data: [] } })),
        productAPI.getCategories().catch(() => ({ data: { data: [] } }))
      ]);

      setStats(statsRes.data.data);
      setProducts(productsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.create(newProduct);
      toast.success('Product added successfully!');
      setShowAddProductModal(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '', discount: '0' });
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to add product: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete product: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await sellerAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
      setShowOrderModal(false);
      setSelectedOrder(null);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productAPI.updateStatus(productId, { status: newStatus });
      toast.success(`Product ${newStatus === 'active' ? 'activated' : newStatus === 'inactive' ? 'deactivated' : 'banned'}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleDiscountUpdate = async (productId, discount) => {
    try {
      await productAPI.update(productId, { discount: Number(discount) });
      toast.success('Discount updated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update discount');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p className="subtitle">Manage your products and orders</p>
          </div>
          <Button onClick={() => fetchDashboardData()} variant="secondary">
            <RefreshIcon /> Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card revenue-card">
            <div className="stat-icon revenue">
              <DollarSignIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p>Total Revenue</p>
              <span className="stat-detail">All time earnings</span>
            </div>
          </Card>

          <Card className="stat-card products-card" onClick={() => setActiveView('products')}>
            <div className="stat-icon products">
              <ShoppingBagIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats?.totalProducts || 0}</h3>
              <p>Total Products</p>
              <span className="stat-detail">Active listings</span>
            </div>
          </Card>

          <Card className="stat-card orders-card" onClick={() => setActiveView('orders')}>
            <div className="stat-icon orders">
              <PackageIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats?.totalOrders || 0}</h3>
              <p>Total Orders</p>
              <span className="stat-detail">All time</span>
            </div>
          </Card>

          <Card className="stat-card pending-card">
            <div className="stat-icon pending">
              <TrendingUpIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats?.pendingOrders || 0}</h3>
              <p>Pending Orders</p>
              <span className="stat-detail pending">Needs attention</span>
            </div>
          </Card>
        </div>

        {/* View Tabs */}
        <div className="view-tabs">
          <button 
            className={`tab-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <BarChartIcon /> Overview
          </button>
          <button 
            className={`tab-btn ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
          >
            <ShoppingBagIcon /> My Products
          </button>
          <button 
            className={`tab-btn ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveView('orders')}
          >
            <PackageIcon /> Orders
          </button>
          <button 
            className={`tab-btn ${activeView === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveView('manage')}
          >
            <SettingsIcon /> Manage Products
          </button>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="dashboard-section">
            <Card>
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => setShowAddProductModal(true)}>
                  <PlusIcon size={24} />
                  <span>Add New Product</span>
                </button>
                <button className="action-btn" onClick={() => setActiveView('products')}>
                  <EditIcon size={24} />
                  <span>Manage Inventory</span>
                </button>
                <button className="action-btn" onClick={() => setActiveView('orders')}>
                  <PackageIcon size={24} />
                  <span>View Orders</span>
                </button>
                <button className="action-btn" onClick={() => navigate('/messages')}>
                  <MessageSquareIcon size={24} />
                  <span>Customer Messages</span>
                </button>
              </div>
            </Card>

            <Card className="recent-activity">
              <h2><TrendingUpIcon /> Recent Orders</h2>
              {orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td className="order-id">#{order._id?.slice(-8)}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td className="amount">${(order.total || order.totalAmount || 0).toFixed(2)}</td>
                          <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No orders yet</p>
              )}
            </Card>
          </div>
        )}

        {/* Products View */}
        {activeView === 'products' && (
          <Card>
            <div className="section-header">
              <h2><ShoppingBagIcon /> My Products</h2>
              <Button onClick={() => setShowAddProductModal(true)} variant="primary">
                <PlusIcon /> Add Product
              </Button>
            </div>
            {products.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Sales</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
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
                        <td>{product.category?.name || 'N/A'}</td>
                        <td className="amount">${product.price?.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td><span className={`status-badge ${product.status}`}>{product.status}</span></td>
                        <td>{product.sold || 0}</td>
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => navigate(`/product/${product._id}`)} title="View Product">
                            <EyeIcon />
                          </button>
                          <button className="icon-btn edit" onClick={() => navigate(`/product/${product._id}/edit`)} title="Edit Product">
                            <EditIcon />
                          </button>
                          <button className="icon-btn delete" onClick={() => handleDeleteProduct(product._id)} title="Delete Product">
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <p>No products yet. Start by adding your first product!</p>
                <Button onClick={() => setShowAddProductModal(true)} variant="primary">
                  <PlusIcon /> Add Your First Product
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Orders View */}
        {activeView === 'orders' && (
          <Card>
            <div className="section-header">
              <h2><PackageIcon /> Order Management</h2>
              <p className="section-subtitle">Track and manage your orders</p>
            </div>
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id?.slice(-8)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{order.items?.length || 0} items</td>
                        <td className="amount">${(order.total || order.totalAmount || 0).toFixed(2)}</td>
                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => handleViewOrder(order)} title="View Details">
                            <EyeIcon />
                          </button>
                          
                          {order.status === 'pending' && (
                            <>
                              <button 
                                className="icon-btn process" 
                                onClick={() => handleUpdateOrderStatus(order._id, 'processing')} 
                                title="Mark as Processing"
                              >
                                <RefreshIcon />
                              </button>
                              <button 
                                className="icon-btn cancel" 
                                onClick={() => {
                                  if (window.confirm('Cancel this order?')) {
                                    handleUpdateOrderStatus(order._id, 'cancelled');
                                  }
                                }} 
                                title="Cancel Order"
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                          
                          {order.status === 'processing' && (
                            <>
                              <button 
                                className="icon-btn ship" 
                                onClick={() => handleUpdateOrderStatus(order._id, 'shipped')} 
                                title="Mark as Shipped"
                              >
                                <TruckIcon />
                              </button>
                              <button 
                                className="icon-btn cancel" 
                                onClick={() => {
                                  if (window.confirm('Cancel this order?')) {
                                    handleUpdateOrderStatus(order._id, 'cancelled');
                                  }
                                }} 
                                title="Cancel Order"
                              >
                                <CloseIcon />
                              </button>
                            </>
                          )}
                          
                          {order.status === 'shipped' && (
                            <button 
                              className="icon-btn deliver" 
                              onClick={() => handleUpdateOrderStatus(order._id, 'delivered')} 
                              title="Mark as Delivered"
                            >
                              <CheckCircleIcon />
                            </button>
                          )}
                          
                          {(order.status === 'delivered' || order.status === 'cancelled') && (
                            <button 
                              className="icon-btn message" 
                              onClick={() => navigate(`/messages`)} 
                              title="Message Customer"
                            >
                              <MessageSquareIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No orders yet</p>
            )}
          </Card>
        )}

        {/* Manage Products View */}
        {activeView === 'manage' && (
          <Card>
            <div className="section-header">
              <h2><SettingsIcon /> Manage Products</h2>
              <p className="section-subtitle">Control product status and discounts</p>
            </div>

            <div className="filters-bar">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({products.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({products.filter(p => p.status === 'active').length})
              </button>
              <button 
                className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
                onClick={() => setFilter('inactive')}
              >
                Inactive ({products.filter(p => p.status === 'inactive').length})
              </button>
              <button 
                className={`filter-btn ${filter === 'banned' ? 'active' : ''}`}
                onClick={() => setFilter('banned')}
              >
                Banned ({products.filter(p => p.status === 'banned').length})
              </button>
            </div>

            {products.filter(p => filter === 'all' || p.status === filter).length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => filter === 'all' || p.status === filter).map(product => (
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
                        <td className="amount">${product.price?.toFixed(2)}</td>
                        <td>
                          <div className="discount-control">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={product.discount || 0}
                              onChange={(e) => handleDiscountUpdate(product._id, e.target.value)}
                              className="discount-input"
                            />
                            <span className="discount-label">%</span>
                          </div>
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
                          </select>
                        </td>
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
                            onClick={() => handleDeleteProduct(product._id)}
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
              <p className="no-data">No products found for this filter</p>
            )}
          </Card>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <Modal isOpen={showAddProductModal} onClose={() => setShowAddProductModal(false)} title="Add New Product">
          <form onSubmit={handleAddProduct} className="product-form">
            <Input
              label="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
              placeholder="Enter product name"
            />
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
                placeholder="Enter product description"
                rows="4"
                className="form-textarea"
              />
            </div>
            <div className="form-row">
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                placeholder="0.00"
              />
              <Input
                label="Stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
                placeholder="0"
              />
            </div>
            <div className="form-row">
              <Input
                label="Discount (%)"
                type="number"
                min="0"
                max="100"
                step="1"
                value={newProduct.discount}
                onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
                className="form-input"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <Button type="button" variant="secondary" onClick={() => setShowAddProductModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Add Product</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Order Details & Update Modal */}
      {showOrderModal && selectedOrder && (
        <Modal isOpen={showOrderModal} onClose={() => { setShowOrderModal(false); setSelectedOrder(null); }} title={`Order #${selectedOrder._id?.slice(-8)}`}>
          <div className="order-details">
            <div className="detail-section">
              <h3>Customer Information</h3>
              <div className="detail-row">
                <strong>Name:</strong> <span>{selectedOrder.user?.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong> <span>{selectedOrder.user?.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> <span>{selectedOrder.shippingAddress?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Shipping Address</h3>
              <div className="detail-row">
                <span>
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                  {selectedOrder.shippingAddress?.country}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                      alt={item.product?.name || 'Product'}
                      className="item-thumb"
                    />
                    <div className="item-info">
                      <strong>{item.product?.name || item.name || 'Product'}</strong>
                      <span>Qty: {item.quantity} × ${item.price?.toFixed(2)}</span>
                    </div>
                    <div className="item-total">${(item.quantity * item.price)?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Order Summary</h3>
              <div className="detail-row">
                <strong>Subtotal:</strong> <span>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="detail-row">
                <strong>Tax:</strong> <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="detail-row">
                <strong>Shipping:</strong> <span>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="detail-row total-row">
                <strong>Total:</strong> <strong className="amount">${selectedOrder.total?.toFixed(2) || selectedOrder.totalAmount?.toFixed(2) || '0.00'}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h3>Update Order Status</h3>
              <div className="detail-row">
                <strong>Current Status:</strong> 
                <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span>
              </div>
              <div className="status-actions">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button variant="primary" onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'processing')}>
                      Mark as Processing
                    </Button>
                    <Button variant="danger" onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'cancelled')}>
                      Cancel Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'processing' && (
                  <>
                    <Button variant="primary" onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'shipped')}>
                      Mark as Shipped
                    </Button>
                    <Button variant="danger" onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'cancelled')}>
                      Cancel Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'shipped' && (
                  <Button variant="primary" onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'delivered')}>
                    Mark as Delivered
                  </Button>
                )}
                {selectedOrder.status === 'delivered' && (
                  <div className="status-message">✅ Order has been delivered successfully!</div>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <div className="status-message cancelled">❌ This order has been cancelled</div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="secondary" onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SellerDashboard;

