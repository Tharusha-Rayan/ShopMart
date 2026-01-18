const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed', 'bogo', 'buy_x_get_y']
  },
  value: {
    type: Number,
    required: [true, 'Please provide discount value'],
    min: [0, 'Value cannot be negative']
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase cannot be negative']
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  buyQuantity: Number, // for buy_x_get_y
  getQuantity: Number, // for buy_x_get_y
  isActive: {
    type: Boolean,
    default: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for performance
couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
