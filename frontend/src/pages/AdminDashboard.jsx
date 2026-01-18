import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';
import { adminAPI, productAPI, orderAPI } from '../services/api';
import { UsersIcon, ShoppingBagIcon, DollarSignIcon, TrendingUpIcon, PackageIcon, AlertCircleIcon, SettingsIcon, BarChartIcon, TrashIcon, UserMinusIcon, EyeIcon, RefreshIcon } from '../components/icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProfit: 0,
    pendingOrders: 0,
    activeUsers: 0,
    newUsersToday: 0,
    revenueGrowth: 0,
    totalSellers: 0,
    activeSellers: 0,
    completedOrders: 0,
    avgOrderValue: 0
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        adminAPI.getAllUsers().catch(() => ({ data: { data: [] } })),
        productAPI.getAll().catch(() => ({ data: { data: [] } })),
        orderAPI.getAll().catch(() => ({ data: { data: [] } }))
      ]);

      const usersData = usersRes.data.data || [];
      const productsData = productsRes.data.data || [];
      const ordersData = ordersRes.data.data || [];

      setUsers(usersData.slice(0, 10));
      setProducts(productsData.slice(0, 10));
      setRecentOrders(ordersData.slice(0, 10));

      // Filter data for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const last30DaysOrders = ordersData.filter(order => new Date(order.createdAt) >= thirtyDaysAgo);

      // Calculate total revenue (all sellers + admin revenue from last 30 days)
      const totalRevenue = last30DaysOrders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
      
      // Calculate admin profit (20% commission from last 30 days orders)
      const totalProfit = last30DaysOrders.reduce((sum, order) => {
        const orderSubtotal = order.subtotal || (order.total || order.totalAmount || 0) * 0.85;
        return sum + (orderSubtotal * 0.20);
      }, 0);
      
      const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
      const completedOrders = ordersData.filter(o => o.status === 'delivered').length;
      const today = new Date().setHours(0, 0, 0, 0);
      const newUsersToday = usersData.filter(u => new Date(u.createdAt).setHours(0, 0, 0, 0) === today).length;
      const totalSellers = usersData.filter(u => u.role === 'seller').length;
      const activeSellers = usersData.filter(u => u.role === 'seller' && !u.isBanned).length;
      const avgOrderValue = last30DaysOrders.length > 0 ? totalRevenue / last30DaysOrders.length : 0;

      setStats({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalProfit,
        pendingOrders,
        completedOrders,
        activeUsers: usersData.filter(u => !u.isBanned).length,
        newUsersToday,
        revenueGrowth: 23.5,
        totalSellers,
        activeSellers,
        avgOrderValue
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) return;
    try {
      await adminAPI.banUser(selectedUser._id, banReason);
      toast.success('User banned successfully');
      setShowBanModal(false);
      setBanReason('');
      setSelectedUser(null);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to ban user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBanProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to ban this product?')) return;
    try {
      await adminAPI.banProduct(productId);
      toast.success('Product banned successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to ban product: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Control Panel</h1>
            <p className="subtitle">Comprehensive system management and analytics</p>
          </div>
          <Button onClick={() => fetchDashboardData()} variant="secondary">
            <RefreshIcon /> Refresh Data
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card revenue-card">
            <div className="stat-icon revenue">
              <DollarSignIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>${(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Total Store Revenue</p>
              <span className="stat-detail">Last 30 days</span>
            </div>
          </Card>

          <Card className="stat-card revenue-card">
            <div className="stat-icon revenue">
              <TrendingUpIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>${(stats.totalProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Admin Commission (20%)</p>
              <span className="stat-detail">Last 30 days</span>
            </div>
          </Card>

          <Card className="stat-card users-card" onClick={() => setActiveView('users')}>
            <div className="stat-icon users">
              <UsersIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-detail">+{stats.newUsersToday} today</span>
            </div>
          </Card>

          <Card className="stat-card products-card" onClick={() => setActiveView('products')}>
            <div className="stat-icon products">
              <ShoppingBagIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts.toLocaleString()}</h3>
              <p>Total Products</p>
              <span className="stat-detail">Active listings</span>
            </div>
          </Card>
        </div>

        {/* Additional Analytics Grid */}
        <div className="stats-grid">
          <Card className="stat-card orders-card" onClick={() => setActiveView('orders')}>
            <div className="stat-icon orders">
              <PackageIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders.toLocaleString()}</h3>
              <p>Total Orders</p>
              <span className="stat-detail">{stats.completedOrders} completed</span>
            </div>
          </Card>

          <Card className="stat-card pending-card">
            <div className="stat-icon pending">
              <AlertCircleIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
              <span className="stat-detail pending">Needs attention</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon users">
              <UsersIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.activeSellers}/{stats.totalSellers}</h3>
              <p>Active Sellers</p>
              <span className="stat-detail">Seller accounts</span>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon orders">
              <DollarSignIcon size={32} />
            </div>
            <div className="stat-info">
              <h3>${stats.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Avg Order Value</p>
              <span className="stat-detail">Per transaction</span>
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
            className={`tab-btn ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => setActiveView('users')}
          >
            <UsersIcon /> User Management
          </button>
          <button 
            className={`tab-btn ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => setActiveView('products')}
          >
            <ShoppingBagIcon /> Product Management
          </button>
          <button 
            className={`tab-btn ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveView('orders')}
          >
            <PackageIcon /> Order Management
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
          <div className="admin-sections">
            <Card>
              <h2><SettingsIcon /> System Management</h2>
              <div className="management-grid">
                <button className="mgmt-btn" onClick={() => setActiveView('users')}>
                  <UsersIcon size={24} />
                  <span>Manage Users</span>
                  <small>{stats.totalUsers} users</small>
                </button>
                <button className="mgmt-btn" onClick={() => setActiveView('products')}>
                  <ShoppingBagIcon size={24} />
                  <span>Manage Products</span>
                  <small>{stats.totalProducts} products</small>
                </button>
                <button className="mgmt-btn" onClick={() => setActiveView('orders')}>
                  <PackageIcon size={24} />
                  <span>Manage Orders</span>
                  <small>{stats.pendingOrders} pending</small>
                </button>
                <button className="mgmt-btn" onClick={() => navigate('/admin/categories')}>
                  <AlertCircleIcon size={24} />
                  <span>Manage Categories</span>
                  <small>8 categories</small>
                </button>
              </div>
            </Card>

            <Card className="recent-activity">
              <h2><TrendingUpIcon /> Recent Orders</h2>
              {recentOrders.length > 0 ? (
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
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>#{order._id?.slice(-8)}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td className="amount">${order.totalAmount?.toFixed(2)}</td>
                          <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No recent orders</p>
              )}
            </Card>
          </div>
        )}

        {/* Users Management View */}
        {activeView === 'users' && (
          <Card>
            <div className="section-header">
              <h2><UsersIcon /> User Management</h2>
              <p className="section-subtitle">Manage all registered users</p>
            </div>
            {users.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="user-cell">
                          <img src={user.avatar || '/placeholder.jpg'} alt={user.name} className="user-avatar" />
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                        <td>
                          <span className={`status-badge ${user.isBanned ? 'banned' : 'active'}`}>
                            {user.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => { setSelectedUser(user); setShowUserModal(true); }} title="View Details">
                            <EyeIcon />
                          </button>
                          {!user.isBanned && (
                            <button className="icon-btn ban" onClick={() => { setSelectedUser(user); setShowBanModal(true); }} title="Ban User">
                              <UserMinusIcon />
                            </button>
                          )}
                          <button className="icon-btn delete" onClick={() => handleDeleteUser(user._id)} title="Delete User">
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No users found</p>
            )}
          </Card>
        )}

        {/* Products Management View */}
        {activeView === 'products' && (
          <Card>
            <div className="section-header">
              <h2><ShoppingBagIcon /> Product Management</h2>
              <p className="section-subtitle">Monitor and manage all products</p>
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
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => navigate(`/product/${product._id}`)} title="View Product">
                            <EyeIcon />
                          </button>
                          <button className="icon-btn ban" onClick={() => handleBanProduct(product._id)} title="Ban Product">
                            <UserMinusIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No products found</p>
            )}
          </Card>
        )}

        {/* Orders Management View */}
        {activeView === 'orders' && (
          <Card>
            <div className="section-header">
              <h2><PackageIcon /> Order Management</h2>
              <p className="section-subtitle">Track and manage all orders</p>
            </div>
            {recentOrders.length > 0 ? (
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
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id?.slice(-8)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{order.items?.length || 0} items</td>
                        <td className="amount">${order.totalAmount?.toFixed(2)}</td>
                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => navigate(`/orders`)} title="View Order">
                            <EyeIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No orders found</p>
            )}
          </Card>
        )}

        {/* Manage Products View */}
        {activeView === 'manage' && (
          <Card>
            <div className="section-header">
              <h2><SettingsIcon /> Manage All Products</h2>
              <p className="subtitle">Comprehensive product management across all sellers</p>
            </div>
            <div className="table-responsive">
              {products.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Seller</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Sales</th>
                      <th>Commission (20%)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {product.images?.[0]?.url && (
                              <img 
                                src={product.images[0].url} 
                                alt={product.name} 
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                            )}
                            <span style={{ fontWeight: '600' }}>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.seller?.name || 'N/A'}</td>
                        <td className="amount">${product.price?.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td><span className={`status-badge ${product.status}`}>{product.status}</span></td>
                        <td>{product.sold || 0} sold</td>
                        <td className="amount">${((product.price || 0) * 0.20).toFixed(2)}</td>
                        <td className="action-cell">
                          <button className="icon-btn view" onClick={() => navigate(`/product/${product._id}`)} title="View Product">
                            <EyeIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No products found</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <Modal isOpen={showUserModal} onClose={() => { setShowUserModal(false); setSelectedUser(null); }} title="User Details">
          <div className="user-details">
            <div className="detail-row">
              <strong>Name:</strong> <span>{selectedUser.name}</span>
            </div>
            <div className="detail-row">
              <strong>Email:</strong> <span>{selectedUser.email}</span>
            </div>
            <div className="detail-row">
              <strong>Role:</strong> <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span>
            </div>
            <div className="detail-row">
              <strong>Status:</strong> <span className={`status-badge ${selectedUser.isBanned ? 'banned' : 'active'}`}>{selectedUser.isBanned ? 'Banned' : 'Active'}</span>
            </div>
            <div className="detail-row">
              <strong>Joined:</strong> <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowUserModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <Modal isOpen={showBanModal} onClose={() => { setShowBanModal(false); setBanReason(''); setSelectedUser(null); }} title="Ban User">
          <div className="ban-form">
            <p>Are you sure you want to ban <strong>{selectedUser?.name}</strong>?</p>
            <label>Ban Reason:</label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter reason for banning this user..."
              rows="4"
              className="ban-textarea"
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => { setShowBanModal(false); setBanReason(''); setSelectedUser(null); }}>Cancel</Button>
              <Button variant="primary" onClick={handleBanUser} disabled={!banReason.trim()}>Ban User</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;

