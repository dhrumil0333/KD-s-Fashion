import React from 'react';
import './About.css';
import img from '../img/about.png'; 

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About KD Clothing</h1>
        <p className="tagline">Wear Your Style. Customize Your Vibe.</p>

        <div className="about-grid">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              KD Clothing is more than just a brand — it’s a lifestyle. Born with the idea of self-expression, we specialize in premium quality T-shirts that combine bold designs with customizable creativity. Whether it's streetwear, minimalism, or graphic tees — we design what defines you.
            </p>

            <h2>What We Do</h2>
            <p>
              We offer customizable and ready-to-wear T-shirts that reflect attitude, art, and authenticity. All our products are crafted using high-grade fabrics, vibrant printing, and sustainable materials to ensure both comfort and style.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
              <li>✅ Trend-driven designs</li>
              <li>✅ Premium, eco-friendly fabric</li>
              <li>✅ Customization for personal or business needs</li>
              <li>✅ Fast and reliable delivery</li>
            </ul>
          </div>

          <div className="about-image">
            <img src={img} alt="About KD Clothing" />
          </div>
        </div>
      </div>
    </div>
  );
}
