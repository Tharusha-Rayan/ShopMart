import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { TrashIcon, ShoppingBagIcon, ArrowRightIcon } from '../components/icons';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const [selectedItems, setSelectedItems] = React.useState([]);

  React.useEffect(() => {
    // Select all items by default
    setSelectedItems(cart.map(item => item._id));
  }, [cart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      // Error already handled in context
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item._id));
    }
  };

  const getSelectedTotal = () => {
    return cart
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => {
        const product = item.product || item;
        const price = product.price || 0;
        const discount = product.discount || 0;
        const finalPrice = price * (1 - discount / 100);
        return total + finalPrice * item.quantity;
      }, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <ShoppingBagIcon className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Start adding products to your cart</p>
          <Link to="/products">
            <Button variant="primary" size="large">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart ({getCartCount()} items)</h1>

        <div className="cart-grid">
          <div className="cart-items">
            <div className="select-all">
              <label>
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === cart.length && cart.length > 0}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
            </div>
            {cart.map((item) => {
              const product = item.product || item;
              const productId = product._id;
              const itemId = item._id;
              const discount = product.discount || 0;
              return (
              <Card key={itemId} className="cart-item">
                <div className="item-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(itemId)}
                    onChange={() => toggleItemSelection(itemId)}
                  />
                </div>
                <div className="item-image">
                  <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} />
                </div>
                <div className="item-details">
                  <Link to={`/product/${productId}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <p className="item-price">
                    ${(product.price * (1 - discount / 100)).toFixed(2)}
                  </p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleQuantityChange(itemId, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <button 
                    onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${((product.price * (1 - discount / 100)) * item.quantity).toFixed(2)}
                </div>
                <button
                  className="item-remove"
                  onClick={() => removeFromCart(itemId)}
                  aria-label="Remove item"
                >
                  <TrashIcon />
                </button>
              </Card>
            );
            })}
          </div>

          <div className="cart-summary">
            <Card>
              <h2>Order Summary</h2>
              <p className="selected-count">{selectedItems.length} of {cart.length} items selected</p>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getSelectedTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>$5.00</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(getSelectedTotal() + 5).toFixed(2)}</span>
              </div>
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout <ArrowRightIcon />
              </Button>
              <Link to="/products">
                <Button variant="secondary" size="large" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

