const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    rating: { type: Number, default: 0, index: true },
    category: { type: String, required: true, index: true },

    // Base64 image
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, rating: -1 });

module.exports = mongoose.model("Product", productSchema);