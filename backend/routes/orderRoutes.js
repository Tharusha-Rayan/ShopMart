const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, getOrder, updateOrderStatus } = require('../controllers/combinedController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;
