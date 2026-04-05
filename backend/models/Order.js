const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [orderItemSchema],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Completed',
        'Cancelled',
      ],
      default: 'Processing',
    },

    // ✅ FIXED (object, not string)
    shippingAddress: {
      fullName: String,
      line1: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    paymentMethod: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);