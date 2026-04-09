const mongoose = require('mongoose');

const aiChatLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    sessionId: {
      type: String,
      trim: true,
      maxlength: [120, 'Session ID cannot exceed 120 characters'],
      default: null,
      index: true
    },
    query: {
      type: String,
      required: [true, 'Query is required'],
      trim: true,
      maxlength: [1000, 'Query cannot exceed 1000 characters']
    },
    intent: {
      type: String,
      enum: ['greeting', 'product_search', 'order_tracking', 'return_policy', 'shipping_info', 'fallback'],
      default: 'fallback'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    responsePreview: {
      type: String,
      trim: true,
      maxlength: [300, 'Response preview cannot exceed 300 characters'],
      default: null
    },
    unresolved: {
      type: Boolean,
      default: false,
      index: true
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

module.exports = mongoose.model('AiChatLog', aiChatLogSchema);
