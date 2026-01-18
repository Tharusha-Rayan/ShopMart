import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ShoppingBagIcon, PackageIcon, TruckIcon, DollarSignIcon, ClockIcon } from '../components/icons';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingDeliveries: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getMyOrders();
      const ordersData = data.data || [];
      
      setOrders(ordersData);
      
      const totalSpent = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      const completedOrders = ordersData.filter(o => o.status === 'delivered').length;
      const pendingDeliveries = ordersData.filter(o => 
        ['pending', 'processing', 'shipped', 'out_for_delivery'].includes(o.status)
      ).length;

      setStats({
        totalOrders: ordersData.length,
        pendingDeliveries,
        completedOrders,
        totalSpent
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-gray',
      processing: 'badge-blue',
      shipped: 'badge-purple',
      out_for_delivery: 'badge-orange',
      delivered: 'badge-green',
      cancelled: 'badge-red'
    };
    return badges[status] || 'badge-gray';
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="buyer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Buyer Dashboard</h1>
            <p className="welcome-text">Welcome back, {user?.name}!</p>
          </div>
          <div className="header-actions">
            <Button
              variant="secondary"
              icon={<ShoppingBagIcon />}
              onClick={() => window.location.href = '/products'}
            >
              Continue Shopping
            </Button>
          </div>
        </div>

        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
              <ShoppingBagIcon style={{ color: '#1976D2' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
              <ClockIcon style={{ color: '#FB8C00' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingDeliveries}</h3>
              <p>Pending Deliveries</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
              <PackageIcon style={{ color: '#43A047' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.completedOrders}</h3>
              <p>Completed Orders</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#F3E5F5' }}>
              <DollarSignIcon style={{ color: '#8E24AA' }} />
            </div>
            <div className="stat-info">
              <h3>${stats.totalSpent.toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </Card>
        </div>

        <div className="dashboard-tabs">
          <button
            className={activeView === 'overview' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveView('overview')}
          >
            <ShoppingBagIcon /> Overview
          </button>
          <button
            className={activeView === 'orders' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveView('orders')}
          >
            <PackageIcon /> My Orders
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {activeView === 'overview' && (
              <div className="overview-section">
                <Card>
                  <div className="section-header">
                    <h2>Recent Orders</h2>
                    <Link to="/orders">
                      <Button variant="secondary" size="small">View All</Button>
                    </Link>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="empty-state">
                      <ShoppingBagIcon className="empty-icon" />
                      <h3>No Orders Yet</h3>
                      <p>Start shopping to see your orders here</p>
                      <Link to="/products">
                        <Button variant="primary">Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="orders-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order._id}>
                              <td>#{order._id.slice(-8)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>{order.items?.length || 0} items</td>
                              <td>${order.total?.toFixed(2)}</td>
                              <td>
                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                  {formatStatus(order.status)}
                                </span>
                              </td>
                              <td>
                                <Link to={`/track-order/${order._id}`}>
                                  <Button variant="secondary" size="small">
                                    <TruckIcon /> Track
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                <div className="quick-links">
                  <Card className="quick-link-card">
                    <ShoppingBagIcon className="link-icon" />
                    <h3>Browse Products</h3>
                    <p>Discover new products</p>
                    <Link to="/products">
                      <Button variant="primary" fullWidth>Shop Now</Button>
                    </Link>
                  </Card>

                  <Card className="quick-link-card">
                    <PackageIcon className="link-icon" />
                    <h3>Order History</h3>
                    <p>View all your orders</p>
                    <Link to="/orders">
                      <Button variant="secondary" fullWidth>View Orders</Button>
                    </Link>
                  </Card>

                  <Card className="quick-link-card">
                    <TruckIcon className="link-icon" />
                    <h3>Track Orders</h3>
                    <p>Track your deliveries</p>
                    <Link to="/orders">
                      <Button variant="secondary" fullWidth>Track Now</Button>
                    </Link>
                  </Card>
                </div>
              </div>
            )}

            {activeView === 'orders' && (
              <Card>
                <h2>All Orders</h2>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBagIcon className="empty-icon" />
                    <h3>No Orders Yet</h3>
                    <p>Start shopping to see your orders here</p>
                    <Link to="/products">
                      <Button variant="primary">Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="orders-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td>#{order._id.slice(-8)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.items?.length || 0} items</td>
                            <td>${order.total?.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${getStatusBadge(order.status)}`}>
                                {formatStatus(order.status)}
                              </span>
                            </td>
                            <td>
                              <Link to={`/track-order/${order._id}`}>
                                <Button variant="secondary" size="small">
                                  <TruckIcon /> Track
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;

