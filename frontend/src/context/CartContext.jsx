import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';import { toast } from 'react-toastify';
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCart(guestCart);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        const { data } = await cartAPI.add({ productId: product._id || product, quantity });
        setCart(data.data?.items || []);
      } else {
        // Local cart for non-authenticated users
        const productId = product._id || product;
        const productObj = typeof product === 'object' ? product : { _id: product };
        const existingItem = cart.find(item => (item.product?._id || item.product) === productId);
        
        if (existingItem) {
          const newCart = cart.map(item => 
            (item.product?._id || item.product) === productId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          setCart(newCart);
          localStorage.setItem('guestCart', JSON.stringify(newCart));
        } else {
          const newCart = [...cart, { product: productObj, quantity }];
          setCart(newCart);
          localStorage.setItem('guestCart', JSON.stringify(newCart));
        }
      }
      const productName = typeof product === 'object' ? product.name : 'Item';
      toast.success(`${productName} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        const { data } = await cartAPI.update(itemId, { quantity });
        setCart(data.data?.items || []);
        toast.success('Quantity updated');
      } else {
        const newCart = cart.map(item => 
          item._id === itemId
            ? { ...item, quantity }
            : item
        );
        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
        toast.success('Quantity updated');
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const { data } = await cartAPI.remove(itemId);
        setCart(data.data?.items || []);
      } else {
        const newCart = cart.filter(item => item._id !== itemId);
        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartAPI.clear();
      } else {
        localStorage.removeItem('guestCart');
      }
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || 0;
      const discount = item.product?.discount || 0;
      const finalPrice = price * (1 - discount / 100);
      return total + finalPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
