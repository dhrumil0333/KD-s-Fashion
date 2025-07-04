// routes/cart.js
const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const cartItem = new CartItem(req.body);
    await cartItem.save();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error("Error saving cart item:", err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// routes/cart.js
router.get('/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const cartItems = await CartItem.find({ email: userEmail });
    res.json(cartItems);
  } catch (err) {
    console.error("❌ Failed to fetch cart items:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/update/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quantity' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
});


module.exports = router;
