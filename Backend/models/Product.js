const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  brand: String,
  description: String,
  price: Number,
  category: { type: String, enum: ['Dino', 'Logo'] },
  image: String, // path to uploaded image
  model3D: String, // path to .glb file
  stock: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
