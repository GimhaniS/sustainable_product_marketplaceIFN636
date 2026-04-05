const express = require('express');
const router  = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
} = require('../controllers/OrderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer places an order
router.post('/', protect, createOrder);

// Admin: view all orders
router.get('/', protect, adminOnly, getAllOrders);

// Admin: view one order / update its status
router.get('/:id',    protect, adminOnly, getOrderById);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;