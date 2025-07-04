import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import banner from '../img/Banner.png';
import Card from './Card.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dino');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const featured = products.slice(0, 3); // Display first 3 as featured
  const newArrivals = products.filter(p => p.category === selectedCategory);

  return (
    <div className="home">
      {/* ✅ Banner Image */}
      <div className="banner">
        <img src={banner} alt="DQ Clothing Banner" />
      </div>

      <header className="hero-section">
        <h1>Welcome to KD Clothing</h1>
        <p>Wear your style. Customize your vibe.</p>
        <Link to="/product" className="explore-btn">Explore Collection</Link>
      </header>

      <section className="products-section">
  <h2>Featured Products</h2>
  <div className="products-grid">
    {featured.map((product) => (
  product._id ? (
    <div key={product._id} className="product-card" style={{height: 'auto'}}>
      <img src={`http://localhost:5000/${product.image}`} alt={product.title}/>
      <h3>{product.title}</h3>
      <p>₹{product.price}</p>
      <Link to={`/product/${product._id}`} className="buy-btn">View Product</Link>
    </div>
  ) : null
))}
  </div>
</section>


      <section className="new-arrivals-section">
        <div className="text">
          <p className="section-title">New Arrivals</p>
          <h4 className="section-description">
            Fresh styles just dropped. Grab your favorites now!
          </h4>
        </div>

        <div className="KDbtn">
          <button className={`bt ${selectedCategory === 'Dino' ? 'active' : ''}`} onClick={() => handleCategoryClick('Dino')}>Dino T-Shirts</button>
          <button className={`bt ${selectedCategory === 'Logo' ? 'active' : ''}`} onClick={() => handleCategoryClick('Logo')}>Logo T-Shirts</button>
        </div>

        <div className="product121">
  {newArrivals
    .filter(product => product._id) // ✅ ensures _id exists
    .map((product) => (
      <Card
  id={product._id}
  title={product.title}
  brand={product.brand}
  price={"₹"+product.price}
  stock={product.stock? "In Stock" : 'Out of Stock'}
  img={`http://localhost:5000/${product.image}`}
/>

  ))}
</div>

      </section>
    </div>
  );
}
