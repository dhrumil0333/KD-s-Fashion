import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../img/login.png';
import { useAuth } from '../context/AuthContext'; // Add this


export default function Login() {
  const { setUser } = useAuth(); // Add this
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', loginData);

    // Store token and user separately
    localStorage.setItem('authToken', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user)); // assuming res.data.user has user info

    setUser({ ...res.data.user, token: res.data.token });

    alert("Login Successful ✅");
    navigate('/');
    window.dispatchEvent(new Event("storage")); 
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-image">
        <img src={loginImg} alt="Login visual" />
      </div>
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Signup</Link>    <br />   
           <Link to="/forgot-password">Forget Password ?</Link>
        </p>
      </div>
    </div>
  );
}
