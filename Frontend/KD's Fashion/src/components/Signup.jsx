import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../img/login.png';

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Signup Successful ✅");
      navigate('/login');
    } catch (err) {
      console.error("❌ Signup failed:", err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-image">
        <img src={signupImg} alt="Signup visual" />
      </div>
      <div className="auth-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSignup}>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <button type="submit">Signup</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
