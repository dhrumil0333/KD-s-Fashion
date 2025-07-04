import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', brand: '', description: '', price: '', category: 'Dino', stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageUpload = (e) => setImageFile(e.target.files[0]);
  const handleModelUpload = (e) => setModelFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (imageFile) data.append("image", imageFile);
    if (modelFile) data.append("model3D", modelFile);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingId}`, data);
        alert("✅ Product updated");
      } else {
        await axios.post('http://localhost:5000/api/admin/add-product', data);
        alert("✅ Product added");
      }

      setForm({ title: '', brand: '', description: '', price: '', category: 'Dino', stock: '' });
      setImageFile(null);
      setModelFile(null);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting form");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      brand: product.brand,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
        alert("🗑️ Product deleted");
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("❌ Failed to delete product");
      }
    }
  };

  return (
    <div className="admin-container" style={{ marginTop: '100px' }}>
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <form className="admin-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Dino">Dino</option>
          <option value="Logo">Logo</option>
        </select>
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />

        <label>Upload Image:</label>
        <input type="file" onChange={handleImageUpload} accept="image/*" />

        <label>Upload 3D Model (.glb):</label>
        <input type="file" onChange={handleModelUpload} accept=".glb" />

        <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h2 className="product-list-heading">📦 Product List</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            <img src={`http://localhost:5000/${product.image}`} alt={product.title} />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)}>✏️ Edit</button>
              <button onClick={() => handleDelete(product._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
