import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductPage.css';
import { useNavigate } from 'react-router-dom'; 

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div className="product-page">
      <h1 className="product-heading">Explore Our Collection</h1>

      <div className="category-tabs">
        {['All', 'Dino', 'Logo'].map(cat => (
          <button
            key={cat}
            className={`tab-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
  {filteredProducts.map((product) => (
    <div
      key={product._id}
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.title}
        className="product-img"
      />
      <h3>{product.title}</h3>
      <p className="price">₹{product.price}</p>
      <p className="brand">{product.brand}</p>
    </div>
  ))}
</div>

    </div>
  );
}
