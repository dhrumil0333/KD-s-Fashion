const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const path = require('path');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("✅ Login successful");
    res.json({ token, admin: { id: admin._id, email: admin.email } });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


const upload = multer({ storage });

const adminAuth = require('../middleware/adminAuth'); // protect routes

router.post(
  '/add-product',
  adminAuth,
  upload.fields([{ name: 'image' }, { name: 'model3D' }]),
  async (req, res) => {
    try {
      const { title, description, price, brand, category, stock } = req.body;
      const imagePath = req.files?.image?.[0]?.path;
      const modelPath = req.files?.model3D?.[0]?.path;

      const product = new Product({
        title,
        brand,
        description,
        price,
        category,
        image: imagePath,
        model3D: modelPath,
        stock,
      });

      await product.save();
      res.status(201).json({ message: '✅ Product added' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Get all products (Admin only)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update product (Admin only)
router.put(
  '/products/:id',
  adminAuth,
  upload.fields([{ name: 'image' }, { name: 'model3D' }]),
  async (req, res) => {
    const { id } = req.params;
    const { title, brand, description, price, category, stock } = req.body;

    try {
      const updateData = { title, brand, description, price, category, stock };
      if (req.files.image) updateData.image = req.files.image[0].path;
      if (req.files.model3D) updateData.model3D = req.files.model3D[0].path;

      await Product.findByIdAndUpdate(id, updateData);
      res.json({ message: 'Product updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Delete product (Admin only)
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
