
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI, reviewAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Package, Truck, Check, Clock, MapPin, Star, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './TrackOrderPage.css';

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

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
      pending: <Clock />,
      processing: <Package />,
      shipped: <Truck />,
      out_for_delivery: <Truck />,
      delivered: <Check />
    };
    return icons[status] || <Clock />;
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
    { key: 'pending', label: 'Order Placed', icon: <Check /> },
    { key: 'processing', label: 'Processing', icon: <Package /> },
    { key: 'shipped', label: 'Shipped', icon: <Truck /> },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck /> },
    { key: 'delivered', label: 'Delivered', icon: <Check /> }
  ];

  const isStepCompleted = (stepKey) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    return stepIndex <= currentIndex;
  };

  const handleOpenReviewModal = (item) => {
    setSelectedProduct(item);
    setReviewForm({ rating: 5, title: '', comment: '' });
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewForm({ rating: 5, title: '', comment: '' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await reviewAPI.create({
        product: selectedProduct.product,
        order: order._id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment
      });
      
      toast.success('Review submitted successfully!');
      handleCloseReviewModal();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const canReview = () => {
    if (!order || !user) {
      console.log('Cannot review: No order or user', { order: !!order, user: !!user });
      return false;
    }
    const orderUserId = typeof order.user === 'object' ? order.user._id : order.user;
    const isDelivered = order.status === 'delivered';
    const isOwner = orderUserId === user.id || orderUserId === user._id;
    
    console.log('Review check:', {
      status: order.status,
      isDelivered,
      orderUserId,
      currentUserId: user.id || user._id,
      isOwner
    });
    
    return isDelivered && isOwner;
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
              <Package className="error-icon" />
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
              {user && (
                <div style={{ padding: '10px', background: canReview() ? '#d4edda' : '#fff3cd', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', border: '1px solid ' + (canReview() ? '#c3e6cb' : '#ffeaa7'), display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {canReview() ? (
                    <>
                      <CheckCircle size={18} color="#155724" />
                      <span><strong>You can write reviews</strong> - Order delivered, click "Write Review" below</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={18} color="#856404" />
                      <span><strong>Reviews not available yet</strong> - Status: {order.status} (needs to be "delivered")</span>
                    </>
                  )}
                </div>
              )}
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                    {canReview() && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleOpenReviewModal(item)}
                        className="review-btn"
                      >
                        <Star size={16} /> Write Review
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="track-sidebar">
            <Card>
              <h3><MapPin /> Delivery Address</h3>
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

        {/* Review Modal */}
        {showReviewModal && (
          <div className="modal-overlay" onClick={handleCloseReviewModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Write a Review</h2>
                <button className="modal-close" onClick={handleCloseReviewModal}>
                  <X />
                </button>
              </div>
              <div className="modal-body">
                {selectedProduct && (
                  <div className="review-product-info">
                    <img src={selectedProduct.image || '/placeholder.jpg'} alt={selectedProduct.name} />
                    <h4>{selectedProduct.name}</h4>
                  </div>
                )}
                <form onSubmit={handleSubmitReview}>
                  <div className="form-group">
                    <label>Your Rating:</label>
                    <div className="stars-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={32}
                          className={star <= reviewForm.rating ? 'filled' : ''}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Review Title:</label>
                    <input
                      type="text"
                      placeholder="Summary of your experience"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Review:</label>
                    <textarea
                      placeholder="Share your experience with this product..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      maxLength={1000}
                      rows={5}
                    />
                  </div>
                  <div className="modal-actions">
                    <Button type="button" variant="outline" onClick={handleCloseReviewModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;


