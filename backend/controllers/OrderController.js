const Order = require('../models/Order');

//  READ ALL (admin sees every order, newest first, with customer info)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'name imageUrl')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  READ ONE
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE STATUS (admin only — only the status field is touched)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updated = await order.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  CREATE (called when a customer places an order — ready for when you build that)
const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      customer: req.user.id,
      status: 'Processing',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
};