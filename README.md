# SmartShop Simple Edition

SmartShop Simple Edition is a cost-friendly MERN e-commerce setup with a reduced role model:
- One admin account for store management
- Buyer accounts for customer actions
- No seller dashboard or seller login flow
- AI chatbot and AI recommendation/search/sentiment features kept

## Simplified Role Model

- Admin (single account): manages catalog, orders, users, coupons, categories, and moderation.
- Buyer: registration, login, browsing, cart, checkout, wishlist, orders, profile, messaging, reviews.
- Seller role: disabled in this simple edition (seller login is blocked and seller routes are not mounted).

## Remaining Functionalities

### Buyer Features
- Register and login as buyer
- Browse/search/filter products
- Product detail view
- Add/remove cart items
- Place orders and view order history
- Track order status
- Wishlist management
- Profile management
- Notifications
- Messaging
- Reviews

### Admin Features
- Admin dashboard
- User management (view/ban only, no delete)
- Product management (create/update/delete/status)
- Order management and status updates
- Category management
- Coupon management
- Product moderation

### AI Features (Kept)
- AI chat assistant widget
- AI semantic search endpoints
- AI recommendation endpoints
- AI sentiment endpoints
- AI event logging

## Tech Stack

- Frontend: React, React Router, Context API, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT
- AI: backend AI service layer and chatbot API routes

## Project Structure

- backend/: API server, routes, controllers, AI services, seed script
- frontend/: React app and UI pages/components

## Setup

### 1. Install backend

```bash
cd backend
npm install
```

### 2. Configure backend env

Create backend/.env with at least:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartshop
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Install frontend

```bash
cd ../frontend
npm install
```

### 4. Seed database (simple edition)

```bash
cd ../backend
node utils/seeder.js
```

Seeded accounts:
- Admin: admin1@shophub.com / Admin@123
- Buyer 1: buyer1@shophub.com / Buyer@123
- Buyer 2: buyer2@shophub.com / Buyer@123

All seeded products are owned by the single admin account.

### Restore Admin Account (without reseeding)

If the admin account was deleted accidentally:

```bash
cd backend
npm run ensure-admin
```

You can override credentials with env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.

## Run

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm start
```

## Notes for This Edition

- Seller routes are unmounted from the server.
- Product and order status management endpoints are admin-only.
- User deletion is disabled for admin tools (ban is used instead).
- Admin can add products from the product creation form route: `/admin/products/new`.
- Registration creates buyers only.
- Seller login is blocked to enforce the simplified model.
- AI chatbot and related AI APIs remain available.
