import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ToastContainer } from 'react-toastify';
import { LoaderIcon } from './components/icons';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';
import './index.css';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ProductEditPage = lazy(() => import('./pages/ProductEditPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const NotificationCenter = lazy(() => import('./pages/NotificationCenter'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const ManageProductsPage = lazy(() => import('./pages/ManageProductsPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ShippingInfoPage = lazy(() => import('./pages/ShippingInfoPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-wrapper">
    <LoaderIcon size={48} color="var(--color-primary)" />
    <p className="loading-text">Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <div className="App">
                <Navbar />
                <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <main>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductListingPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/product/:id/edit" element={<ProductEditPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/seller/dashboard" element={<SellerDashboard />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                      <Route path="/notifications" element={<NotificationCenter />} />
                      <Route path="/messages" element={<MessagesPage />} />
                      <Route path="/manage-products" element={<ManageProductsPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/shipping-info" element={<ShippingInfoPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
