
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { PackageIcon, TruckIcon, CheckIcon, ClockIcon, MapPinIcon } from '../components/icons';
import './TrackOrderPage.css';

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getOne(orderId);
      setOrder(data.data);
    } catch (err) {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ClockIcon />,
      processing: <PackageIcon />,
      shipped: <TruckIcon />,
      out_for_delivery: <TruckIcon />,
      delivered: <CheckIcon />
    };
    return icons[status] || <ClockIcon />;
  };

  const getStatusProgress = (status) => {
    const progress = {
      pending: 20,
      processing: 40,
      shipped: 60,
      out_for_delivery: 80,
      delivered: 100
    };
    return progress[status] || 0;
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: <CheckIcon /> },
    { key: 'processing', label: 'Processing', icon: <PackageIcon /> },
    { key: 'shipped', label: 'Shipped', icon: <TruckIcon /> },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: <TruckIcon /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckIcon /> }
  ];

  const isStepCompleted = (stepKey) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    return stepIndex <= currentIndex;
  };

  if (loading) {
    return (
      <div className="track-order-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-order-page">
        <div className="container">
          <Card>
            <div className="error-state">
              <PackageIcon className="error-icon" />
              <h2>Order Not Found</h2>
              <p>We couldn't find an order with this ID</p>
              <Link to="/orders">
                <Button variant="primary">View All Orders</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="track-order-page">
      <div className="container">
        <h1>Track Your Order</h1>
        <p className="order-id">Order ID: #{order._id}</p>

        <div className="track-grid">
          <div className="track-main">
            <Card>
              <h2>Order Status</h2>
              
              <div className="status-timeline">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className={`status-step ${isStepCompleted(step.key) ? 'completed' : ''} ${order.status === step.key ? 'active' : ''}`}>
                    <div className="step-icon">
                      {step.icon}
                    </div>
                    <div className="step-info">
                      <h4>{step.label}</h4>
                      {order.status === step.key && (
                        <p className="step-date">Current Status</p>
                      )}
                      {isStepCompleted(step.key) && order.status !== step.key && (
                        <p className="step-date">Completed</p>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`step-line ${isStepCompleted(statusSteps[index + 1].key) ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>

              {order.tracking?.trackingNumber && (
                <div className="tracking-info">
                  <h3>Tracking Information</h3>
                  <div className="tracking-details">
                    <div className="tracking-row">
                      <span className="label">Carrier:</span>
                      <span className="value">{order.tracking.carrier}</span>
                    </div>
                    <div className="tracking-row">
                      <span className="label">Tracking Number:</span>
                      <span className="value">{order.tracking.trackingNumber}</span>
                    </div>
                    {order.tracking.estimatedDelivery && (
                      <div className="tracking-row">
                        <span className="label">Estimated Delivery:</span>
                        <span className="value">
                          {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h3>Order Items</h3>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="track-sidebar">
            <Card>
              <h3><MapPinIcon /> Delivery Address</h3>
              <div className="shipping-address">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="phone">{order.shippingAddress.phone}</p>
              </div>
            </Card>

            <Card>
              <h3>Order Summary</h3>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount:</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="payment-method">
                <p><strong>Payment Method:</strong></p>
                <p>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;

