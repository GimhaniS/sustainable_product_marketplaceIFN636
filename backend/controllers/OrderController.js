const Order = require('../models/Order');
const Cart = require('../models/Cart');

// ✅ ADMIN - GET ALL
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

// ✅ GET SINGLE
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

// ✅ UPDATE STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Completed',
      'Cancelled',
    ];

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

// ✅ CUSTOMER - GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name imageUrl')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log("error",error);
    
    res.status(500).json({ message: error.message });
  }
};

//  CHECKOUT 
const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, payment } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.qty, 
    }));

    const total = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
// console.log("order",order);

    const order = await Order.create({
      customer: userId,
      items: orderItems,
      total,
      shippingAddress: address,
      paymentMethod: payment,
      status: 'Processing',
    });

    // 🔥 clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  createOrderFromCart,
};