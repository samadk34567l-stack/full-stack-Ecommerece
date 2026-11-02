const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    pinCode: { type: String, default: '' },
    notes: { type: String, default: '' },
    avatar: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Inactive', 'Blocked'],
      default: 'Active',
    },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
