
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Card from '../components/common/Card';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiPackage className="status-icon pending" />;
      case 'processing':
      case 'shipped':
        return <FiTruck className="status-icon shipped" />;
      case 'delivered':
        return <FiCheckCircle className="status-icon delivered" />;
      default:
        return <FiPackage className="status-icon" />;
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <p className="no-orders">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </Card>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Card key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-badge ${order.status}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img 
                        src={item.image || '/placeholder.jpg'} 
                        alt={item.name || 'Product'} 
                      />
                      <div className="order-item-info">
                        <p>{item.name || 'Product'}</p>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="order-item-price">${(item.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>${order.total?.toFixed(2) || '0.00'}</strong>
                  </div>
                  <div className="order-actions">
                    <Link to={`/track-order/${order._id}`} className="btn btn-secondary btn-small">
                      Track Order
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
