# 🛒 SmartShop - Full-Stack E-Commerce Platform

A comprehensive, production-ready multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

> **Perfect for Learning MERN Stack Development!** This project demonstrates real-world patterns, authentication, file uploads, state management, and complete CRUD operations.

## 📚 Learning Guide

This README is structured to help you learn MERN stack development through practical examples from this project. Each section includes:
- 🎯 Concept explanation
- 💡 Real code examples from SmartShop
- 🔍 Best practices
- 🚀 What you'll learn



## 🌟 Features

### Multi-Role System
- **Admin Dashboard**: Complete system management, analytics, commission tracking
- **Seller Dashboard**: Product management, order processing, inventory control
- **Buyer Dashboard**: Shopping cart, wishlist, order tracking, reviews

### Core Functionality
- 🔐 **Authentication & Authorization**: JWT-based secure authentication with role-based access control
- 🛍️ **Product Management**: Full CRUD operations, image uploads, categories, variants, discounts
- 📦 **Order Management**: Complete order lifecycle (pending → processing → shipped → delivered)
- 💳 **Shopping Cart**: Real-time cart management with quantity controls
- ❤️ **Wishlist**: Save favorite products for later
- ⭐ **Reviews & Ratings**: Product reviews with 5-star rating system
- 💬 **Messaging System**: Direct communication between buyers and sellers
- 🔔 **Notifications**: Real-time notifications for order updates and system events
- 📊 **Analytics**: Revenue tracking, profit calculations, sales analytics
- 🎯 **Commission System**: Automatic 20% commission calculation for platform earnings

### Advanced Features
- Product search and filtering
- Category management
- Discount and coupon system
- Order tracking with status history
- Return/refund management
- Email notifications
- Image processing and optimization
- Rate limiting and security middleware
- Error handling and logging

## 🏗️ Tech Stack

### Frontend
- **React 18** with React Router DOM
- **Context API** for state management
- **Axios** for API calls
- **React Toastify** for notifications
- **Lucide React** for icons
- **CSS3** with responsive design

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for emails
- **Express Rate Limit** for API protection
- **Winston** for logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Basic understanding of JavaScript ES6+
- Familiarity with React basics

## 🎓 What You'll Learn

### **M**ongoDB (Database)
- Schema design with Mongoose
- Relationships (references and embedding)
- Indexing for performance
- Aggregation pipelines
- Database seeding

### **E**xpress.js (Backend Framework)
- RESTful API design
- Middleware patterns
- Authentication & Authorization
- File uploads
- Error handling
- Rate limiting

### **R**eact (Frontend Library)
- Functional components & hooks
- Context API for state management
- React Router for navigation
- Form handling
- File uploads from frontend
- Protected routes

### **N**ode.js (Runtime)
- Async/await patterns
- Event loop understanding
- NPM package management
- Environment variables
- Production best practices

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd SmartShop
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartshop
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Seed Database
```bash
cd backend
node utils/seeder.js
```

This will create:
- 3 Admin accounts
- 10 Seller accounts
- 10 Buyer accounts
- 8 Product categories
- 100 Products (10 per seller)
- 30 Sample orders
- 50 Product reviews
- Sample carts and wishlists

## 🎮 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```
App runs on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 👥 Login Credentials

After seeding the database, use these credentials:

### Admin Accounts
- Email: `admin1@shophub.com` to `admin3@shophub.com`
- Password: `Admin@123`

### Seller Accounts
- Email: `seller1@shophub.com` to `seller10@shophub.com`
- Password: `Seller@123`

### Buyer Accounts
- Email: `buyer1@shophub.com` to `buyer10@shophub.com`
- Password: `Buyer@123`

## 📁 Project Structure

```
SmartShop/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product operations
│   │   ├── cartController.js     # Cart management
│   │   └── combinedController.js # Orders, reviews, etc.
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Error handling
│   │   ├── rateLimiter.js        # Rate limiting
│   │   └── upload.js             # File upload handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema (with commission)
│   │   ├── Order.js              # Order schema (with adminProfit)
│   │   ├── Cart.js               # Cart schema
│   │   ├── Review.js             # Review schema
│   │   └── ...                   # Other models
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── productRoutes.js      # Product routes
│   │   ├── adminRoutes.js        # Admin routes
│   │   └── ...                   # Other routes
│   ├── utils/
│   │   ├── emailService.js       # Email sending
│   │   ├── imageProcessor.js     # Image processing
│   │   ├── logger.js             # Winston logger
│   │   └── seeder.js             # Database seeder
│   ├── uploads/                  # Uploaded files
│   ├── logs/                     # Application logs
│   └── server.js                 # Express server
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Reusable components
│   │   │   ├── layout/           # Layout components
│   │   │   └── product/          # Product components
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Landing page
│   │   │   ├── LoginPage.jsx     # Login
│   │   │   ├── RegisterPage.jsx  # Registration
│   │   │   ├── AdminDashboard.jsx    # Admin panel
│   │   │   ├── SellerDashboard.jsx   # Seller panel
│   │   │   ├── BuyerDashboard.jsx    # Buyer dashboard
│   │   │   ├── ProductListingPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── ...               # Other pages
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   ├── CartContext.jsx   # Cart state
│   │   │   └── ...               # Other contexts
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Main app component
│   │   └── index.js              # Entry point
│   └── package.json
│
└── README.md                     # This file
```

## 🎨 Key Features Explained

### 1. Authentication System (JWT)

**🎯 What is JWT?**
JSON Web Tokens are a secure way to transmit information between client and server. The token contains user data and is signed to prevent tampering.

**💡 Example from SmartShop:**

**Backend - Creating Token** (`backend/utils/jwtUtils.js`)
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

**Backend - Verifying Token** (`backend/middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;
  
  // Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  
  try {
    // Verify token and decode user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
```

**Frontend - Storing and Using Token** (`frontend/src/context/AuthContext.jsx`)
```javascript
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  
  // Store in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  setUser(user);
  setToken(token);
};
```

**Frontend - Sending Token with Requests** (`frontend/src/services/api.js`)
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**🔍 What You Learn:**
- How JWT authentication works
- Storing tokens securely
- Protecting routes with middleware
- Automatic token injection in API calls

---

### 2. MongoDB Schema Design

**🎯 What are Schemas?**
Schemas define the structure of your data in MongoDB. They specify field types, validation rules, and relationships.

**💡 Example - User Schema** (`backend/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    default: 'buyer'
  },
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
```

**💡 Example - Product Schema with References** (`backend/models/Product.js`)
```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'  // Reference to Category model
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [String],  // Array of image URLs
  specifications: {
    type: Map,  // Key-value pairs
    of: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.price * (1 - this.discount / 100);
});

// Populate seller info when querying
productSchema.pre(/^find/, function(next) {
  this.populate('seller', 'name email');
  next();
});
```

**🔍 What You Learn:**
- Schema field types and validation
- Relationships using references
- Virtual fields (computed properties)
- Schema middleware (hooks)
- Data modeling best practices

---

### 3. RESTful API Design

**🎯 What is REST?**
REST is an architectural style for APIs. Resources are accessed via HTTP methods (GET, POST, PUT, DELETE).

**💡 Example - Product Routes** (`backend/routes/productRoutes.js`)
```javascript
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all products (Public)
router.get('/', productController.getProducts);

// GET single product (Public)
router.get('/:id', productController.getProduct);

// POST create product (Seller only)
router.post('/', 
  protect,  // Must be logged in
  authorize('seller', 'admin'),  // Must be seller or admin
  upload.array('images', 5),  // Can upload up to 5 images
  productController.createProduct
);

// PUT update product (Owner only)
router.put('/:id',
  protect,
  authorize('seller', 'admin'),
  upload.array('images', 5),
  productController.updateProduct
);

// DELETE product (Owner only)
router.delete('/:id',
  protect,
  authorize('seller', 'admin'),
  productController.deleteProduct
);

module.exports = router;
```

**💡 Example - Controller** (`backend/controllers/productController.js`)
```javascript
// GET /api/products?search=laptop&category=electronics&minPrice=100
exports.getProducts = async (req, res, next) => {
  try {
    // Build query
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Execute query with pagination
    const products = await Product.find(query)
      .populate('seller', 'name')
      .populate('category', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');
    
    const count = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    // Get uploaded image paths
    const images = req.files?.map(file => `/uploads/products/${file.filename}`) || [];
    
    // Parse specifications if JSON string
    let specifications = req.body.specifications;
    if (typeof specifications === 'string') {
      specifications = JSON.parse(specifications);
    }
    
    const product = await Product.create({
      ...req.body,
      seller: req.user.id,  // From JWT token
      images,
      specifications
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};
```

**🔍 What You Learn:**
- HTTP methods and their purposes
- Query parameters for filtering
- Pagination implementation
- File upload handling
- Middleware chaining
- Error handling with try-catch

---

### 4. React Context API for State Management

**🎯 What is Context API?**
Context provides a way to share data across the entire component tree without passing props manually at every level.

**💡 Example - Auth Context** (`frontend/src/context/AuthContext.jsx`)
```javascript
import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(token);
    setUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
  
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isBuyer: user?.role === 'buyer'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**💡 Using Context in Components**
```javascript
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};
```

**💡 Example - Cart Context** (`frontend/src/context/CartContext.jsx`)
```javascript
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isAuthenticated } = useAuth();
  
  // Fetch cart from API
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);
  
  const fetchCart = async () => {
    const response = await cartAPI.getCart();
    setCart(response.data.data);
  };
  
  const addToCart = async (productId, quantity = 1) => {
    await cartAPI.addToCart(productId, quantity);
    await fetchCart();  // Refresh cart
  };
  
  const removeFromCart = async (itemId) => {
    await cartAPI.removeItem(itemId);
    await fetchCart();
  };
  
  const updateQuantity = async (itemId, quantity) => {
    await cartAPI.updateQuantity(itemId, quantity);
    await fetchCart();
  };
  
  // Calculate totals
  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.product.price * (1 - item.product.discount / 100) * item.quantity);
  }, 0);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

**🔍 What You Learn:**
- Creating and providing context
- Custom hooks for cleaner code
- Sharing state across components
- localStorage for persistence
- Computed values (totals, counts)
- Synchronizing with backend

---

### 5. Commission System (Business Logic)

**🎯 How It Works:**
Platform takes 20% commission on all sales. This is calculated when order is created and stored for admin analytics.

**💡 Backend - Order Creation** (`backend/controllers/combinedController.js`)
```javascript
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Calculate order total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}` 
        });
      }
      
      // Calculate item price (with discount)
      const itemPrice = product.price * (1 - product.discount / 100);
      const itemTotal = itemPrice * item.quantity;
      
      totalAmount += itemTotal;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice
      });
      
      // Update stock
      product.stock -= item.quantity;
      product.numSold += item.quantity;
      await product.save();
    }
    
    // Calculate commission (20% of total)
    const commissionRate = 0.20;
    const adminProfit = totalAmount * commissionRate;
    const sellerRevenue = totalAmount - adminProfit;
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: totalAmount,
      adminProfit,  // Platform commission
      sellerRevenue,  // What seller receives
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });
    
    // Clear user's cart
    await Cart.deleteMany({ user: req.user.id });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
```

**💡 Frontend - Admin Analytics** (`frontend/src/pages/AdminDashboard.jsx`)
```javascript
const fetchDashboardData = async () => {
  // Get orders from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data } = await adminAPI.getOrders();
  const recentOrders = data.data.filter(order => 
    new Date(order.createdAt) >= thirtyDaysAgo
  );
  
  // Calculate revenue
  const storeRevenue = recentOrders.reduce((sum, order) => 
    sum + order.total, 0
  );
  
  // Calculate platform profit (commission)
  const platformProfit = recentOrders.reduce((sum, order) => 
    sum + (order.adminProfit || 0), 0
  );
  
  setStats({
    storeRevenue,
    platformProfit,
    totalOrders: recentOrders.length,
    completedOrders: recentOrders.filter(o => o.status === 'delivered').length
  });
};
```

**🔍 What You Learn:**
- Calculating business metrics
- Commission models
- Stock management
- Transaction integrity
- Date filtering
- Aggregating data

---

### 6. File Upload System

**🎯 How It Works:**
Files are uploaded to the server using `multer` middleware and stored in the `uploads` directory.

**💡 Backend - Upload Middleware** (`backend/middleware/upload.js`)
```javascript
const multer = require('multer');
const path = require('path');

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Different folders for different file types
    if (req.baseUrl.includes('/products')) {
      uploadPath += 'products/';
    } else if (req.baseUrl.includes('/users')) {
      uploadPath += 'avatars/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  }
});

module.exports = upload;
```

**💡 Frontend - Upload Form** (`frontend/src/pages/ProductEditPage.jsx`)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', formState.name);
    formData.append('description', formState.description);
    formData.append('price', formState.price);
    formData.append('stock', formState.stock);
    
    // Add existing images (IDs to keep)
    formData.append('existingImages', JSON.stringify(existingImages));
    
    // Add new image files
    newImages.forEach(file => {
      formData.append('images', file);
    });
    
    // Add specifications as JSON
    formData.append('specifications', JSON.stringify(formState.specifications));
    
    // Send to API
    await productAPI.updateProduct(productId, formData);
    
    toast.success('Product updated successfully!');
    navigate('/seller/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to update product');
  }
};

// Image preview before upload
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  
  // Limit total images
  if (existingImages.length + files.length > 5) {
    toast.error('Maximum 5 images allowed');
    return;
  }
  
  // Create preview URLs
  const previews = files.map(file => URL.createObjectURL(file));
  setImagePreviews([...imagePreviews, ...previews]);
  setNewImages([...newImages, ...files]);
};
```

**🔍 What You Learn:**
- FormData for file uploads
- Multer configuration
- File validation
- Image previews
- Managing multiple files
- Updating vs creating with files

---

### 7. Protected Routes & Authorization

**🎯 Frontend Protection:**
Prevent unauthorized users from accessing certain pages.

**💡 Protected Route Component** (`frontend/src/App.jsx`)
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Component to protect routes
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Usage in routes
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute roles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/seller/dashboard" 
  element={
    <ProtectedRoute roles={['seller']}>
      <SellerDashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/buyer/dashboard" 
  element={
    <ProtectedRoute roles={['buyer']}>
      <BuyerDashboard />
    </ProtectedRoute>
  } 
/>
```

**💡 Backend Authorization** (`backend/middleware/auth.js`)
```javascript
// Middleware to check specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};

// Check resource ownership
exports.checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      // Check if user owns the resource
      const ownerId = resource.seller || resource.user;
      
      if (ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to modify this resource' });
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage in routes
router.put('/products/:id',
  protect,  // Must be logged in
  authorize('seller', 'admin'),  // Must be seller or admin
  checkOwnership(Product),  // Must own the product
  productController.updateProduct
);
```

**🔍 What You Learn:**
- Client-side route protection
- Server-side authorization
- Role-based access control (RBAC)
- Resource ownership verification
- Middleware composition
- Security best practices

---

### 8. Error Handling Patterns

**🎯 Centralized Error Handling:**
All errors are caught and formatted consistently.

**💡 Backend Error Handler** (`backend/middleware/errorHandler.js`)
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging
  console.error(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

**💡 Frontend Error Handling** (`frontend/src/services/api.js`)
```javascript
// Intercept responses to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        // Forbidden
        toast.error('You do not have permission to perform this action');
      } else if (error.response.status === 404) {
        // Not found
        toast.error('Resource not found');
      } else if (error.response.status === 500) {
        // Server error
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);
```

**💡 Using Try-Catch in Components**
```javascript
const handleDelete = async (productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  try {
    await productAPI.deleteProduct(productId);
    toast.success('Product deleted successfully');
    fetchProducts();  // Refresh list
  } catch (error) {
    // Error already handled by interceptor
    // Can add additional logic here if needed
    console.error('Delete failed:', error);
  }
};
```

**🔍 What You Learn:**
- Centralized error handling
- HTTP status codes
- Error response formatting
- Global error interception
- User-friendly error messages
- Graceful degradation

---

## 📚 Learning Path

### Week 1: Backend Basics
1. Study `backend/models/` - Understand schema design
2. Study `backend/middleware/auth.js` - Learn JWT authentication
3. Study `backend/controllers/authController.js` - See registration/login logic
4. **Exercise:** Add a new field to User model (e.g., phone number)

### Week 2: API Development
1. Study `backend/routes/` - Learn RESTful routing
2. Study `backend/controllers/productController.js` - CRUD operations
3. Study `backend/middleware/upload.js` - File uploads
4. **Exercise:** Create a new API endpoint for product search by seller

### Week 3: Frontend Basics
1. Study `frontend/src/context/AuthContext.jsx` - Learn Context API
2. Study `frontend/src/services/api.js` - API integration
3. Study `frontend/src/pages/LoginPage.jsx` - Form handling
4. **Exercise:** Add form validation to registration

### Week 4: Advanced Frontend
1. Study `frontend/src/pages/ProductDetailPage.jsx` - Complex components
2. Study `frontend/src/context/CartContext.jsx` - State management
3. Study `frontend/src/App.jsx` - Routing and protected routes
4. **Exercise:** Add a product comparison feature

### Week 5: Full Stack Integration
1. Study order creation flow (frontend → backend → database)
2. Study file upload flow (both directions)
3. Study authentication flow (login → token → protected routes)
4. **Exercise:** Implement a wishlist feature

---

## 🛠️ Common Patterns & Best Practices

### 1. Async/Await Pattern
```javascript
// ✅ Good - Clean error handling
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/products');
    setProducts(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// ❌ Bad - No error handling
const fetchData = async () => {
  const response = await api.get('/products');
  setProducts(response.data);
};
```

### 2. Component Structure
```javascript
// ✅ Good - Organized structure
const ProductCard = ({ product }) => {
  // 1. Hooks at the top
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // 2. Event handlers
  const handleAddToCart = async () => {
    await addToCart(product._id);
    toast.success('Added to cart!');
  };
  
  // 3. Render helpers
  const renderPrice = () => {
    if (product.discount > 0) {
      return (
        <>
          <span className="original-price">${product.price}</span>
          <span className="discounted-price">${product.finalPrice}</span>
        </>
      );
    }
    return <span className="price">${product.price}</span>;
  };
  
  // 4. JSX return
  return (
    <div className="product-card">
      {/* content */}
    </div>
  );
};
```

### 3. API Service Layer
```javascript
// ✅ Good - Centralized API calls
// services/api.js
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// Usage in component
import { productAPI } from '../services/api';

const products = await productAPI.getAll({ category: 'electronics' });

// ❌ Bad - Scattered API calls
// Direct axios calls in components
const response = await axios.get('http://localhost:5000/api/products');
```

### 4. Environment Variables
```javascript
// ✅ Good - Use environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// ❌ Bad - Hardcoded values
const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/mydb';
const JWT_SECRET = 'mysecret123';
```

### 5. Input Validation
```javascript
// ✅ Good - Validate on both sides
// Backend
const createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  
  if (!name || !price || !stock) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  if (price < 0 || stock < 0) {
    return res.status(400).json({ error: 'Price and stock must be positive' });
  }
  
  // Create product...
};

// Frontend
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!name.trim()) {
    toast.error('Name is required');
    return;
  }
  
  if (price <= 0) {
    toast.error('Price must be greater than 0');
    return;
  }
  
  // Submit form...
};
```

---

## 🎯 Practice Exercises

### Beginner Level
1. **Add Phone Number to User**: Modify User schema and registration form
2. **Create Category Filter**: Add dropdown to filter products by category
3. **Add Product Search**: Implement search by product name
4. **User Profile Page**: Display user information with edit capability

### Intermediate Level
1. **Product Reviews**: Implement full review system (already partially done)
2. **Order History**: Show detailed order history with filters
3. **Seller Analytics**: Add charts showing sales over time
4. **Email Notifications**: Send emails on order status changes

### Advanced Level
1. **Real-time Notifications**: Use Socket.IO for live notifications
2. **Payment Integration**: Add Stripe or PayPal payment gateway
3. **Advanced Search**: Elasticsearch integration for powerful search
4. **Admin Dashboard Charts**: Add data visualization with Chart.js
5. **Image Optimization**: Compress and resize uploaded images

---

## 🔍 Debugging Tips

### Backend Issues
```bash
# Check server logs
# Logs are in backend/logs/

# Test API with curl
curl -X GET http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@shophub.com","password":"Buyer@123"}'

# Check MongoDB data
mongosh
use smartshop
db.users.find()
db.products.find()
```

### Frontend Issues
```javascript
// Add console logs strategically
console.log('User data:', user);
console.log('API response:', response.data);
console.log('Form state:', formState);

// Check Context values
const MyComponent = () => {
  const auth = useAuth();
  console.log('Auth context:', auth);
  // ...
};

// Network tab in DevTools
// Check: Request headers, Response status, Response data
```

### Common Errors & Solutions

**Error: "Cannot read property '_id' of undefined"**
```javascript
// ❌ Problem
const userId = user._id;

// ✅ Solution - Optional chaining
const userId = user?._id;

// ✅ Better - Early return
if (!user) return null;
const userId = user._id;
```

**Error: "Cast to ObjectId failed"**
```javascript
// ❌ Problem - Invalid MongoDB ID
const product = await Product.findById('invalid-id');

// ✅ Solution - Validate ID first
const mongoose = require('mongoose');
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ error: 'Invalid ID' });
}
```

**Error: "Headers already sent"**
```javascript
// ❌ Problem - Multiple responses
exports.createProduct = async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: 'Name required' });
  }
  res.status(201).json({ data: product });  // Error!
};

// ✅ Solution - Return after response
if (!req.body.name) {
  return res.status(400).json({ error: 'Name required' });
}
```

---

## 📖 Additional Resources

### Official Documentation
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Node.js Docs](https://nodejs.org/en/docs/)

### Learn More
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [REST API Best Practices](https://restfulapi.net/)

### YouTube Channels
- Traversy Media (MERN Stack)
- The Net Ninja (MongoDB, React)
- Academind (Full Stack Development)
- Web Dev Simplified (React Hooks, Context API)

---
- Platform automatically calculates 20% commission on all sales
- Admin dashboard shows total store revenue and platform profit separately
- Commission is tracked in the `adminProfit` field on orders
- All analytics show data for the last 30 days

### Order Workflow
```
Buyer Places Order → Pending
     ↓
Seller Processes → Processing
     ↓
Seller Ships → Shipped
     ↓
Delivery Complete → Delivered
```

### User Roles & Permissions

| Feature | Admin | Seller | Buyer |
|---------|-------|--------|-------|
| Manage Users | ✅ | ❌ | ❌ |
| Manage All Products | ✅ | Own Products | ❌ |
| Process Orders | ✅ | Own Orders | View Own |
| View Analytics | ✅ Full | Own Stats | Own History |
| Ban/Delete Users | ✅ | ❌ | ❌ |
| Add Products | ❌ | ✅ | ❌ |
| Purchase Products | ❌ | ✅ | ✅ |
| Leave Reviews | ❌ | ✅ | ✅ |

## 🎨 Design System & Color Palette

SmartShop uses a consistent, professional color system throughout the application defined in `frontend/src/styles/colors.css`.

### Primary Colors
```css
--color-primary: #10b981        /* Main brand color (Emerald Green) */
--color-primary-light: #34d399  /* Light variant */
--color-primary-dark: #059669   /* Dark variant */
--color-primary-hover: #047857  /* Hover state */
```

### Status Colors (Dashboard Stat Cards)
```css
/* Success/Active */
--color-status-active: #d1fae5
--color-status-active-text: #065f46

/* Warning/Pending */
--color-status-pending: #fed7aa
--color-status-pending-text: #92400e

/* Error/Inactive */
--color-status-inactive: #fee2e2
--color-status-inactive-text: #991b1b

/* Neutral */
--color-status-neutral: #e5e7eb
--color-status-neutral-text: #374151
```

### Semantic Colors
```css
/* Success */
--color-success: #10b981
--color-success-hover: #059669

/* Warning */
--color-warning: #f59e0b
--color-warning-hover: #d97706

/* Error/Danger */
--color-error: #ef4444
--color-error-hover: #dc2626

/* Info */
--color-info: #3b82f6
--color-info-hover: #2563eb
```

### Text Colors
```css
--text-primary: #1f2937     /* Main text */
--text-secondary: #4b5563   /* Secondary text */
--text-tertiary: #6b7280    /* Muted text */
--text-link: #10b981        /* Link color */
--text-link-hover: #059669  /* Link hover */
```

### Hover Effects
All interactive elements follow consistent hover patterns:
- **Buttons**: Background color darkens + subtle lift (translateY(-2px))
- **Cards**: Shadow increases + small lift (translateY(-2px))
- **Links**: Color changes to hover variant
- **Table Rows**: Background changes to light gray (#f3f4f6)
- **Icons**: Scale slightly (scale(1.1)) + color change

### Usage in CSS
```css
/* Example button */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Example stat card */
.stat-card-success {
  background: var(--color-status-active);
  color: var(--color-status-active-text);
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/my` - Get user's orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics

## 🧪 Testing

### Manual Testing
1. Register accounts for each role
2. Sellers: Add products with different categories and discounts
3. Buyers: Browse products, add to cart, place orders
4. Sellers: Process orders and update status
5. Buyers: Leave reviews and track orders
6. Admin: View analytics, manage users and products

### Test Scenarios
- ✅ User registration and login
- ✅ Product creation with images
- ✅ Add to cart and checkout
- ✅ Order creation with commission calculation
- ✅ Order status updates
- ✅ Product reviews
- ✅ Admin analytics (last 30 days)
- ✅ Seller order management
- ✅ Navigation persistence in dashboards

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting on API endpoints
- Input validation and sanitization
- XSS protection
- CORS configuration
- Secure file upload handling

## 📊 Analytics & Reporting

### Admin Dashboard
- Total Store Revenue (last 30 days)
- Platform Commission/Profit (20%)
- Total Users, Sellers, Buyers
- Total Products across all sellers
- Order statistics (total, pending, completed)
- Average order value
- Active sellers tracking

### Seller Dashboard
- Personal revenue statistics
- Product inventory management
- Order processing queue
- Sales analytics
- Product performance metrics

## 🔄 Recent Updates

- ✅ Fixed navigation tab persistence in admin and seller dashboards
- ✅ Implemented 20% commission system
- ✅ Added adminProfit field to orders
- ✅ Enhanced admin analytics with last 30 days filtering
- ✅ Improved stat card text sizing and color consistency
- ✅ Added comprehensive manage products view
- ✅ Integrated order management workflow
- ✅ Fixed all runtime errors and compilation issues

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB service
# Windows: net start MongoDB
# Mac/Linux: sudo service mongod start
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Clear Database and Reseed
```bash
cd backend
node utils/seeder.js
```

## 📝 Development Notes

- All prices are in USD
- Commission rate is set to 20% (configurable in order creation)
- Images are stored in `/uploads` directory
- Logs are stored in `/backend/logs`
- Session expires after 7 days
- Maximum file upload size: 5MB

## 🤝 Contributing

This is a complete e-commerce platform. To extend:

1. Add payment gateway integration (Stripe, PayPal)
2. Implement real-time chat with Socket.IO
3. Add advanced search with Elasticsearch
4. Implement email verification workflow
5. Add social media authentication
6. Integrate shipping APIs
7. Add product comparison feature
8. Implement advanced analytics dashboard

## � Project Highlights for Learning

### What Makes This Project Great for Learning?

1. **Complete CRUD Operations**: Every model has Create, Read, Update, Delete operations
2. **Authentication & Authorization**: Real-world JWT implementation with role-based access
3. **File Uploads**: Multiple image upload with validation
4. **Complex Relationships**: Users, Products, Orders, Reviews all interconnected
5. **Business Logic**: Commission calculation, stock management, order workflows
6. **State Management**: Context API usage across multiple contexts
7. **Form Handling**: Complex forms with validation
8. **Error Handling**: Comprehensive error handling patterns
9. **Security**: Authentication, authorization, input validation, rate limiting
10. **Production Ready**: Environment variables, logging, proper project structure

### Key Concepts Demonstrated

**Backend:**
- RESTful API design
- Mongoose schemas and relationships
- Middleware composition
- JWT authentication
- File upload handling
- Error handling
- Input validation
- Database transactions

**Frontend:**
- React functional components
- React Hooks (useState, useEffect, useContext, custom hooks)
- Context API for state management
- React Router for navigation
- Protected routes
- Form handling
- API integration
- File upload from frontend

**Full Stack:**
- Client-server communication
- Authentication flow
- File upload flow
- Order creation flow
- Real-time cart updates
- Notification system

## 🎓 Next Steps After Mastering This Project

1. **Add Testing**
   - Backend: Jest + Supertest for API testing
   - Frontend: React Testing Library

2. **Implement WebSockets**
   - Real-time notifications
   - Live chat between buyers and sellers
   - Real-time order tracking

3. **Add Payment Processing**
   - Stripe integration
   - PayPal integration
   - Handle webhooks

4. **Improve Performance**
   - React.memo for optimization
   - Lazy loading for routes
   - Image optimization
   - Database indexing

5. **Deploy to Production**
   - Backend: Heroku, AWS, DigitalOcean
   - Frontend: Netlify, Vercel
   - Database: MongoDB Atlas
   - File storage: AWS S3, Cloudinary

## 📝 Development Notes

- All prices are in USD
- Commission rate is set to 20% (configurable in order creation)
- Images are stored in `/uploads` directory
- Logs are stored in `/backend/logs`
- Session expires after 7 days
- Maximum file upload size: 5MB
- Search functionality preserves query text
- Design system uses centralized CSS variables

## 🆘 Getting Help

If you're stuck or have questions:

1. **Check the code**: Read through similar implementations in the project
2. **Console logs**: Add strategic console.logs to understand data flow
3. **DevTools**: Use Network tab to inspect API calls
4. **Error messages**: Read error messages carefully - they often tell you exactly what's wrong
5. **Documentation**: Refer to official docs for libraries used
6. **Stack Overflow**: Search for specific error messages
7. **GitHub Issues**: Create an issue in the repo

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

SmartShop E-Commerce Platform
Version 1.0.0

---

**Built with ❤️ using MERN Stack**

Happy Learning! 🚀📚
