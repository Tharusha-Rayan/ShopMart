import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  getMe: () => API.get('/api/auth/me'),
  updateDetails: (data) => API.put('/api/auth/update-details', data),
  updatePassword: (data) => API.put('/api/auth/update-password', data),
  forgotPassword: (data) => API.post('/api/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/api/auth/reset-password/${token}`, data),
  verifyEmail: (token) => API.get(`/api/auth/verify-email/${token}`)
};

// Product API
export const productAPI = {
  getAll: (params) => API.get('/api/products', { params }),
  getOne: (id) => API.get(`/api/products/${id}`),
  create: (data) => API.post('/api/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => API.put(`/api/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, data) => API.put(`/api/products/${id}/status`, data),
  delete: (id) => API.delete(`/api/products/${id}`),
  getFeatured: () => API.get('/api/products/featured'),
  getCategories: () => API.get('/api/categories')
};

// Cart API
export const cartAPI = {
  get: () => API.get('/api/cart'),
  add: (data) => API.post('/api/cart', data),
  update: (itemId, data) => API.put(`/api/cart/${itemId}`, data),
  remove: (itemId) => API.delete(`/api/cart/${itemId}`),
  clear: () => API.delete('/api/cart')
};

// Wishlist API
export const wishlistAPI = {
  get: () => API.get('/api/wishlist'),
  add: (productId) => API.post('/api/wishlist', { productId }),
  remove: (productId) => API.delete(`/api/wishlist/${productId}`)
};

// Order API
export const orderAPI = {
  create: (data) => API.post('/api/orders', data),
  getMyOrders: () => API.get('/api/orders/my-orders'),
  getAll: () => API.get('/api/orders'),
  getOne: (id) => API.get(`/api/orders/${id}`),
  updateStatus: (id, status) => API.put(`/api/orders/${id}/status`, { status })
};

// Category API
export const categoryAPI = {
  getAll: () => API.get('/api/categories'),
  create: (data) => API.post('/api/categories', data),
  update: (id, data) => API.put(`/api/categories/${id}`, data),
  delete: (id) => API.delete(`/api/categories/${id}`)
};

// Notification API
export const notificationAPI = {
  getAll: () => API.get('/api/notifications'),
  markAsRead: (id) => API.put(`/api/notifications/${id}/read`),
  delete: (id) => API.delete(`/api/notifications/${id}`)
};

// Message API
export const messageAPI = {
  send: (data) => API.post('/api/messages', data),
  getConversations: () => API.get('/api/messages/conversations'),
  getMessages: (conversationId) => API.get(`/api/messages/${conversationId}`),
  createConversation: (data) => API.post('/api/messages/conversation', data)
};

// Review API
export const reviewAPI = {
  create: (data) => API.post('/api/reviews', data),
  getProductReviews: (productId) => API.get(`/api/reviews/product/${productId}`)
};

// Coupon API
export const couponAPI = {
  validate: (code) => API.post('/api/coupons/validate', { code }),
  getAll: () => API.get('/api/coupons'),
  create: (data) => API.post('/api/coupons', data)
};

// Return API - Deprecated (Return system removed)
// export const returnAPI = {
//   request: (data) => API.post('/api/returns', data),
//   getAll: () => API.get('/api/returns'),
//   update: (id, data) => API.put(`/api/returns/${id}`, data)
// };

// Admin API
export const adminAPI = {
  getAllUsers: () => API.get('/api/admin/users'),
  updateUser: (id, data) => API.put(`/api/admin/users/${id}`, data),
  banUser: (id, reason) => API.put(`/api/admin/users/${id}/ban`, { reason }),
  deleteUser: (id) => API.delete(`/api/admin/users/${id}`),
  getAllProducts: () => API.get('/api/admin/products'),
  banProduct: (id) => API.put(`/api/admin/products/${id}/ban`)
};

// Seller API
export const sellerAPI = {
  getStats: () => API.get('/api/seller/stats'),
  getProducts: () => API.get('/api/seller/products'),
  getOrders: () => API.get('/api/seller/orders'),
  updateOrderStatus: (orderId, status) => API.put(`/api/orders/${orderId}/status`, { status })
};

export default API;
