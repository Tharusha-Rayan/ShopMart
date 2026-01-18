const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), upload.array('images', 10), createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), upload.array('images', 10), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

router.put('/:id/status', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
