const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    bg: {
      type: String,
      default: '#F5F5F5',
    },
    imageUrl: {
      type: String,
      default: '/recycle.png',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);