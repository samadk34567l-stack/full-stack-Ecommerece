const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    image: { type: String, required: true }, 
    images: [{ type: String }],
    category: { type: String, required: true },
    dressStyle: {
      type: String,
      enum: ['Casual', 'Formal', 'Party', 'Gym'],
      default: 'Casual',
    },
    colors: [{ type: String }], 
    sizes: [{ type: String }], 
    description: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
