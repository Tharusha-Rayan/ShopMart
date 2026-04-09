const mongoose = require('mongoose');

const aiEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      trim: true,
      maxlength: [120, 'Session ID cannot exceed 120 characters'],
      index: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['product_view', 'search', 'add_to_cart', 'purchase'],
      index: true
    },
    source: {
      type: String,
      enum: ['web', 'mobile'],
      default: 'web'
    },
    payload: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
      },
      query: {
        type: String,
        trim: true,
        maxlength: [300, 'Search query cannot exceed 300 characters'],
        default: null
      },
      quantity: {
        type: Number,
        min: [1, 'Quantity must be at least 1'],
        default: null
      },
      price: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        default: null
      }
    },
    metadata: {
      userAgent: {
        type: String,
        trim: true,
        maxlength: [500, 'User agent cannot exceed 500 characters'],
        default: null
      },
      ipAddress: {
        type: String,
        trim: true,
        maxlength: [120, 'IP address cannot exceed 120 characters'],
        default: null
      },
      page: {
        type: String,
        trim: true,
        maxlength: [300, 'Page path cannot exceed 300 characters'],
        default: null
      },
      referrer: {
        type: String,
        trim: true,
        maxlength: [400, 'Referrer cannot exceed 400 characters'],
        default: null
      }
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

aiEventSchema.index({ eventType: 1, createdAt: -1 });
aiEventSchema.index({ user: 1, createdAt: -1 });
aiEventSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('AiEvent', aiEventSchema);
