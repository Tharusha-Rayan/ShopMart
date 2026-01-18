const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, banUser, deleteUser, getAllProducts, banProduct } = require('../controllers/combinedController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

router.get('/products', getAllProducts);
router.put('/products/:id/ban', banProduct);

module.exports = router;
