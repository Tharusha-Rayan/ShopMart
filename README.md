# SmartShop Seeded Accounts Summary

## Quantities
- Admin accounts: 1
- Seller accounts: 2
- Buyer accounts: 2
- Total products: 10
- Products per seller: 5

<<<<<<< HEAD
## Username and Password Details

### Admin
- Username: admin1@shophub.com
- Password: Admin@123

### Sellers
- Username: seller1@shophub.com
- Password: Seller@123
- Username: seller2@shophub.com
- Password: Seller@123

### Buyers
- Username: buyer1@shophub.com
- Password: Buyer@123
- Username: buyer2@shophub.com
- Password: Buyer@123
=======
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
>>>>>>> 388d7cefe996e0b8069b5c3873b7dbb1230a6b8c
