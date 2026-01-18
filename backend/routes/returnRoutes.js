const express = require('express');
const router = express.Router();
const { requestReturn, getReturns, updateReturn } = require('../controllers/combinedController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, requestReturn);
router.get('/', protect, getReturns);
router.put('/:id', protect, authorize('admin'), updateReturn);

module.exports = router;
