
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, returnAPI } from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { PackageIcon, AlertCircleIcon } from '../components/icons';
import './RequestReturnPage.css';

const RequestReturnPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [returnData, setReturnData] = useState({
    reason: 'defective',
    description: '',
    selectedItems: []
  });

  const returnReasons = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong_item', label: 'Wrong Item Received' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'damaged', label: 'Damaged in Shipping' },
    { value: 'changed_mind', label: 'Changed My Mind' },
    { value: 'better_price_found', label: 'Found Better Price' },
    { value: 'quality_issues', label: 'Quality Issues' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getOne(orderId);
      const orderData = data.data;
      
      // Check if order is eligible for return (30 days)
      const orderDate = new Date(orderData.createdAt);
      const daysSinceOrder = (Date.now() - orderDate) / (1000 * 60 * 60 * 24);
      
      if (daysSinceOrder > 30) {
        toast.error('Return window has expired (30 days)');
        navigate('/orders');
        return;
      }

      if (orderData.status !== 'delivered') {
        toast.error('Order must be delivered before requesting return');
        navigate('/orders');
        return;
      }

      setOrder(orderData);
      // Initialize all items as selected
      setReturnData(prev => ({
        ...prev,
        selectedItems: orderData.items.map(item => item.product._id || item.product)
      }));
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (productId) => {
    setReturnData(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(productId)
        ? prev.selectedItems.filter(id => id !== productId)
        : [...prev.selectedItems, productId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (returnData.selectedItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    if (!returnData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    try {
      setSubmitting(true);
      
      const items = order.items
        .filter(item => returnData.selectedItems.includes(item.product._id || item.product))
        .map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          reason: returnData.reason
        }));

      await returnAPI.request({
        order: orderId,
        items,
        reason: returnData.reason,
        description: returnData.description
      });

      toast.success('Return request submitted successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="request-return-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="request-return-page">
        <div className="container">
          <Card>
            <div className="error-state">
              <AlertCircleIcon className="error-icon" />
              <h2>Order Not Found</h2>
              <p>Unable to load order details</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const selectedItemsTotal = order.items
    .filter(item => returnData.selectedItems.includes(item.product._id || item.product))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="request-return-page">
      <div className="container">
        <h1>Request Return</h1>
        <p className="order-info">Order #{order._id.slice(-8)} - Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

        <div className="return-info-banner">
          <AlertCircleIcon />
          <div>
            <strong>Return Policy:</strong> Items can be returned within 30 days of delivery. 
            Refunds will be processed within 5-7 business days after approval.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="return-grid">
            <div className="return-main">
              <Card>
                <h2>Select Items to Return</h2>
                <div className="items-list">
                  {order.items.map((item, index) => {
                    const productId = item.product._id || item.product;
                    const isSelected = returnData.selectedItems.includes(productId);
                    
                    return (
                      <div key={index} className={`return-item ${isSelected ? 'selected' : ''}`}>
                        <label className="item-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemToggle(productId)}
                          />
                          <div className="item-content">
                            <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Quantity: {item.quantity}</p>
                              <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <h2>Return Details</h2>
                
                <div className="form-group">
                  <label htmlFor="reason">Reason for Return *</label>
                  <select
                    id="reason"
                    value={returnData.reason}
                    onChange={(e) => setReturnData({ ...returnData, reason: e.target.value })}
                    className="return-select"
                    required
                  >
                    {returnReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    value={returnData.description}
                    onChange={(e) => setReturnData({ ...returnData, description: e.target.value })}
                    placeholder="Please provide detailed information about why you want to return these items..."
                    rows="6"
                    className="return-textarea"
                    required
                  />
                  <small>Minimum 20 characters</small>
                </div>
              </Card>
            </div>

            <div className="return-sidebar">
              <Card>
                <h3>Return Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Items Selected:</span>
                    <span>{returnData.selectedItems.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Return Amount:</span>
                    <span className="amount">${selectedItemsTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="refund-note">
                  <p>
                    <strong>Note:</strong> Shipping costs are non-refundable. 
                    The refund amount will be credited to your original payment method.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={submitting || returnData.selectedItems.length === 0}
                >
                  {submitting ? 'Submitting...' : 'Submit Return Request'}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestReturnPage;

