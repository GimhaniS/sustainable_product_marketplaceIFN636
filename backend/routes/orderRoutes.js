const express = require('express');
const router  = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrderFromCart,getMyOrders
} = require('../controllers/OrderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer places an order
// router.post('/', protect, createOrder);

// Admin: view all orders
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);

// Admin: view one order / update its status
router.get('/:id',    protect, adminOnly, getOrderById);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/checkout', protect, createOrderFromCart);

module.exports = router;