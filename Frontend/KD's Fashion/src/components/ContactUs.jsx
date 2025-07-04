import React from 'react';
import './ContactUs.css';

export default function ContactUs() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>Have any questions or inquiries? We'd love to hear from you!</p>

        <div className="contact-content">
          <form className="contact-form">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" />

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="message">Your Message</label>
            <textarea id="message" rows="5" placeholder="Type your message here..."></textarea>

            <button type="submit">Send Message</button>
          </form>

          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Email: support@dqclothing.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: KD Clothing HQ, Gujarat, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
