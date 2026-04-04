const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    price: { type: Number, required: true },

    imageUrl: { type: String },
    images: [{ type: String }],

    materialCategory: {
      type: String,
      enum: [
        'eco_friendly',
        'recycled',
        'sustainable_fashion',
        'plastic_free',
        'organic',
      ],
      required: true,
    },

    colors: [{ type: String }],

    supplierLicense: { type: String },

    categoryId: { type: Number },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);