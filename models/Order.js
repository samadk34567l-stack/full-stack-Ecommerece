const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: '' },
    shippingAddress: { type: String, default: '' },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        selectedColor: { type: String, default: '' },
        selectedSize: { type: String, default: '' },
        image: { type: String, default: '' },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 15 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Hold', 'Shipped', 'Delivered', 'Complete', 'Cancelled', 'Cancel'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
