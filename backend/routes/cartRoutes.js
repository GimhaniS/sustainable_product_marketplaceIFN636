const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/CartController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;