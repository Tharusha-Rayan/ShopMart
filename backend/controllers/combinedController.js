const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Return = require('../models/Return');
const Category = require('../models/Category');
const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');

// Wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products.product');
    res.status(200).json({ success: true, data: wishlist || { products: [] } });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [{ product: req.body.productId }] });
    } else {
      if (!wishlist.products.find(p => p.product.toString() === req.body.productId)) {
        wishlist.products.push({ product: req.body.productId });
        await wishlist.save();
      }
    }
    await wishlist.populate('products.product');
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    wishlist.products = wishlist.products.filter(p => p.product.toString() !== req.params.productId);
    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// Orders
exports.createOrder = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order must contain at least one item' 
      });
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shipping address is required' 
      });
    }

    // Set user from authenticated user
    req.body.user = req.user.id;
    
    // Ensure all required price fields are present
    if (!req.body.subtotal || !req.body.total) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subtotal and total are required' 
      });
    }

    // Calculate admin profit (20% commission from subtotal)
    const adminCommissionRate = 0.20; // 20%
    req.body.adminProfit = (req.body.subtotal || 0) * adminCommissionRate;

    // Create the order
    const order = await Order.create(req.body);
    
    // Populate order to get full details
    await order.populate('items.product user');
    
    // Create notification for buyer
    try {
      await Notification.create({
        user: req.user.id,
        type: 'order_placed',
        title: 'Order Placed Successfully',
        message: `Your order #${order._id.toString().slice(-8)} has been placed successfully. Total: $${order.total.toFixed(2)}`,
        link: `/track-order/${order._id}`,
        relatedOrder: order._id
      });
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
      // Continue even if notification fails
    }
    
    // Create notifications and messages for sellers
    const sellerMap = new Map();
    for (const item of order.items) {
      if (item.product?.seller) {
        const sellerId = item.product.seller._id || item.product.seller;
        if (!sellerMap.has(sellerId.toString())) {
          sellerMap.set(sellerId.toString(), []);
        }
        sellerMap.get(sellerId.toString()).push(item);
      }
    }
    
    // Send notifications and messages to each seller
    for (const [sellerId, items] of sellerMap) {
      try {
        const itemNames = items.map(i => i.name || 'Unknown Item').join(', ');
        
        // Create notification
        await Notification.create({
          user: sellerId,
          type: 'order_placed',
          title: 'New Order Received',
          message: `You have received a new order from ${order.user.name}. Items: ${itemNames}`,
          link: `/seller/orders`,
          relatedOrder: order._id
        });
        
        // Create message in conversation
        const conversationId = [req.user.id, sellerId].sort().join('-');
        await Message.create({
          conversationId,
          sender: req.user.id,
          receiver: sellerId,
          content: `Hi! I just placed an order for: ${itemNames}. Order ID: #${order._id.toString().slice(-8)}`,
          isSystemMessage: true
        });
      } catch (sellerNotifError) {
        console.log('Seller notification failed:', sellerNotifError.message);
        // Continue even if seller notifications fail
      }
    }
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Order creation error:', error);
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.product user').sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product user');
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user items.product');
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // If user is a seller, check if they own any products in this order
    if (req.user.role === 'seller') {
      const sellerOwnsProduct = order.items.some(item => 
        item.product.seller && item.product.seller.toString() === req.user.id
      );
      
      if (!sellerOwnsProduct) {
        return res.status(403).json({ 
          success: false, 
          error: 'You are not authorized to update this order' 
        });
      }
    }
    
    // Update order status
    order.status = req.body.status;
    await order.save();
    
    // Notify buyer of status change
    const statusMessages = {
      pending: { type: 'order_placed', message: 'Your order is pending confirmation' },
      processing: { type: 'order_processing', message: 'Your order is being processed' },
      shipped: { type: 'order_shipped', message: 'Your order has been shipped and is on the way' },
      out_for_delivery: { type: 'order_shipped', message: 'Your order is out for delivery and will arrive soon' },
      delivered: { type: 'order_delivered', message: 'Your order has been delivered successfully' },
      cancelled: { type: 'order_cancelled', message: 'Your order has been cancelled' }
    };
    
    const statusConfig = statusMessages[req.body.status];
    
    if (statusConfig) {
      try {
        // Create notification for buyer
        await Notification.create({
          user: order.user._id,
          type: statusConfig.type,
          title: 'Order Status Updated',
          message: `Order #${order._id.toString().slice(-8)}: ${statusConfig.message}`,
          link: `/track-order/${order._id}`,
          relatedOrder: order._id
        });
        
        // Send message to buyer
        const sellerId = req.user.id; // Current user (seller/admin) updating the status
        const conversationId = [order.user._id.toString(), sellerId].sort().join('-');
        
        await Message.create({
          conversationId,
          sender: sellerId,
          receiver: order.user._id,
          content: `Order Update: Your order #${order._id.toString().slice(-8)} status has been updated to "${req.body.status}". ${statusConfig.message}`,
          isSystemMessage: true
        });
      } catch (notificationError) {
        console.error('Failed to create notification/message:', notificationError.message);
        // Continue even if notification fails
      }
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Update order status error:', error);
    next(error);
  }
};

// Coupons
exports.validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      code: req.body.code.toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() }
    });
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or expired coupon' });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// Get active coupons (for all users)
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).select('code discountType discountValue minPurchase maxDiscount description expiresAt');
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// Notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt').limit(50);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Messages
exports.createConversation = async (req, res, next) => {
  try {
    const { seller, product } = req.body;
    const participants = [req.user.id, seller].sort();
    const conversationId = participants.join('-') + (product ? `-${product}` : '');
    
    // Check if conversation exists
    let conversation = await Message.findOne({ conversationId });
    
    if (!conversation) {
      conversation = await Message.create({
        conversationId,
        participants,
        product,
        sender: req.user.id,
        content: 'Started conversation',
        isSystemMessage: true
      });
    }
    
    res.status(200).json({ success: true, data: { _id: conversationId, product, otherUser: { _id: seller } } });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    req.body.sender = req.user.id;
    const message = await Message.create(req.body);
    await message.populate('sender receiver');
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).sort('-createdAt').populate('sender receiver product');
    
    // Group by conversation and get latest message for each
    const conversations = [];
    const seen = new Set();
    
    for (const msg of messages) {
      if (!seen.has(msg.conversationId)) {
        seen.add(msg.conversationId);
        const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
        conversations.push({
          _id: msg.conversationId,
          otherUser,
          product: msg.product,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    }
    
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort('createdAt')
      .populate('sender receiver product');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// Returns
exports.requestReturn = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const returnRequest = await Return.create(req.body);
    res.status(201).json({ success: true, data: returnRequest });
  } catch (error) {
    next(error);
  }
};

exports.getReturns = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const returns = await Return.find(query).populate('order user').sort('-createdAt');
    res.status(200).json({ success: true, data: returns });
  } catch (error) {
    next(error);
  }
};

exports.updateReturn = async (req, res, next) => {
  try {
    const returnRequest = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: returnRequest });
  } catch (error) {
    next(error);
  }
};

// Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Reviews
exports.createReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar').sort('-createdAt');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// Admin - Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true, banReason: req.body.reason }, { new: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Admin - Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category seller');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.banProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Seller Dashboard
exports.getSellerStats = async (req, res, next) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);
    
    const totalProducts = sellerProducts.length;
    const orders = await Order.find({ 'items.product': { $in: productIds } });
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
    
    res.status(200).json({ 
      success: true, 
      data: { 
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue
      } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id }).populate('category');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getSellerOrders = async (req, res, next) => {
  try {
    const productIds = await Product.find({ seller: req.user.id }).distinct('_id');
    const orders = await Order.find({ 'items.product': { $in: productIds } }).populate('user items.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
