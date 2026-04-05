const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  res.json(cart);
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, name, price, imageUrl, qty = 1 } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existing = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({
      product: productId,
      name,
      price,
      imageUrl,
      qty,
    });
  }

  await cart.save();
  res.json(cart);
};

// UPDATE QTY
exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, qty } = req.body;

  const cart = await Cart.findOne({ user: userId });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) return res.status(404).json({ msg: 'Item not found' });

  item.qty = qty;

  await cart.save();
  res.json(cart);
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};