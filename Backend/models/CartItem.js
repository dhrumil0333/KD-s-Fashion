// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  color: String,
  imagesUsed: Number,
  customizationFee: Number,
  totalPrice: Number,
  size: String,
  price: Number,
  image: String, 
  quantity: Number,
  snapshots: {
    front: String,
    back: String,
    left: String,
    right: String,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
