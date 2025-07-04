// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const adminAuth = require('../middleware/adminAuth');
// GET all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
