import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistAPI, productAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const normalizeWishlistItem = (item) => {
    const product = item?.product || item;
    if (!product || typeof product !== 'object') return null;

    const parsedPrice = Number(product.price ?? product.originalPrice ?? 0);
    const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

    const parsedOriginal = Number(product.originalPrice ?? price);
    const originalPrice = Number.isFinite(parsedOriginal) ? parsedOriginal : price;

    const parsedDiscount = Number(product.discount ?? 0);
    const discount = Number.isFinite(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : 0;

    const parsedDiscountPrice = Number(
      product.discountPrice ?? (discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price)
    );
    const discountPrice = Number.isFinite(parsedDiscountPrice) ? parsedDiscountPrice : price;

    return {
      ...product,
      _id: product._id || product.id || item?.product || item?._id || item?.id,
      price,
      originalPrice,
      discount,
      discountPrice
    };
  };

  const mapWishlistProducts = (products = []) => {
    return products.map(normalizeWishlistItem).filter(Boolean);
  };

  const hydrateGuestWishlist = async (items = []) => {
    const hydrated = await Promise.all(items.map(async (entry) => {
      if (entry?.price != null || entry?.discountPrice != null || entry?.originalPrice != null) {
        return normalizeWishlistItem(entry);
      }

      const productId = entry?._id || entry?.id || entry;
      if (!productId) return null;

      try {
        const { data } = await productAPI.getOne(productId);
        return normalizeWishlistItem(data?.data || { _id: productId });
      } catch {
        return normalizeWishlistItem(entry);
      }
    }));

    return hydrated.filter(Boolean);
  };

  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        fetchWishlist();
      } else {
        // Load from localStorage for guest users and hydrate id-only entries.
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const hydratedWishlist = await hydrateGuestWishlist(localWishlist);
        setWishlist(hydratedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(hydratedWishlist));
      }
    };

    loadWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistAPI.get();
      const products = data.data?.products || [];
      setWishlist(mapWishlistProducts(products));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const productId = product._id || product;
      if (isAuthenticated) {
        const { data } = await wishlistAPI.add(productId);
        const products = data.data?.products || [];
        setWishlist(mapWishlistProducts(products));
      } else {
        // Local wishlist for guest users
        let productObj = typeof product === 'object' ? product : null;

        if (!productObj && productId) {
          try {
            const { data } = await productAPI.getOne(productId);
            productObj = data?.data || { _id: productId };
          } catch {
            productObj = { _id: productId };
          }
        }

        const normalizedProduct = normalizeWishlistItem(productObj);
        if (!normalizedProduct) return;

        const alreadyExists = wishlist.some(item => item._id === normalizedProduct._id);
        if (alreadyExists) {
          toast.info('Already in wishlist');
          return;
        }

        const newWishlist = [...wishlist, normalizedProduct];
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      }
      toast.success('Added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.remove(productId);
        await fetchWishlist();
      } else {
        const newWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      }
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    wishlistCount: wishlist.length,
    refreshWishlist: fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
