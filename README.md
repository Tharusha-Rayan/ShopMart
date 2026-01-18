# 🛒 SmartShop - Full-Stack E-Commerce Platform

A comprehensive, production-ready multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js).



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

### Commission System
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

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

SmartShop E-Commerce Platform
Version 1.0.0

---

**Built with ❤️ using MERN Stack**
