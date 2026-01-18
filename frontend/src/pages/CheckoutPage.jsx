import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { toast } from 'react-toastify';
import { CreditCardIcon, MapPinIcon } from '../components/icons';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', time: '3-7 business days', cost: 5.00 },
    { id: 'express', name: 'Express Shipping', time: '1-2 business days', cost: 15.00 },
    { id: 'sameday', name: 'Same Day Delivery', time: 'Within 24 hours', cost: 25.00 }
  ];

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const items = cart.map(item => {
        const product = item.product || item;
        return {
          product: product._id,
          name: product.name,
          image: product.images?.[0] || product.image,
          price: product.price * (1 - (product.discount || 0) / 100),
          quantity: item.quantity
        };
      });

      const subtotal = getCartTotal();
      const selectedShipping = shippingMethods.find(m => m.id === shippingMethod);
      const shippingCost = selectedShipping?.cost || 5.00;
      const total = subtotal + shippingCost;

      await orderAPI.create({
        items,
        shippingAddress,
        shippingMethod: selectedShipping,
        paymentMethod,
        subtotal,
        shippingCost,
        total,
        status: 'pending'
      });

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>Your cart is empty</h2>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div className="checkout-forms">
              <Card>
                <h2><MapPinIcon /> Shipping Address</h2>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  required
                />
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc."
                />
                <div className="form-row">
                  <Input
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    required
                  />
                </div>
                <div className="form-row">
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    placeholder="USA"
                    required
                  />
                </div>
              </Card>

              <Card>
                <h2><CreditCardIcon /> Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                    />
                    <span>Credit/Debit Card <small>(Coming Soon)</small></span>
                  </label>
                  <label className="payment-option disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      disabled
                    />
                    <span>PayPal <small>(Coming Soon)</small></span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </Card>

              <Card>
                <h2>Shipping Method</h2>
                <div className="shipping-methods">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className="shipping-method">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={shippingMethod === method.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="shipping-method-info">
                        <strong>{method.name}</strong>
                        <span className="shipping-time">{method.time}</span>
                      </div>
                      <span className="shipping-cost">${method.cost.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </div>

            <div className="order-summary-section">
              <Card>
                <h2>Order Summary</h2>
                <div className="order-items">
                  {cart.map((item) => {
                    const product = item.product || item;
                    return (
                    <div key={product._id} className="summary-item">
                      <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} />
                      <div className="summary-item-details">
                        <p>{product.name}</p>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="summary-item-price">
                        ${((product.price * (1 - (product.discount || 0) / 100)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                  })}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping ({shippingMethods.find(m => m.id === shippingMethod)?.name}):</span>
                    <span>${(shippingMethods.find(m => m.id === shippingMethod)?.cost || 5).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${(getCartTotal() + (shippingMethods.find(m => m.id === shippingMethod)?.cost || 5)).toFixed(2)}</span>
                  </div>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

