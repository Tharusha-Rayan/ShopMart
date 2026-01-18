const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon, getCoupons, getActiveCoupons } = require('../controllers/combinedController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);
router.post('/', protect, authorize('admin'), createCoupon);
router.get('/', protect, authorize('admin'), getCoupons);
router.get('/active', protect, getActiveCoupons); // Public route for users to see available coupons

module.exports = router;
