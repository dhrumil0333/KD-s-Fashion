import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

   useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken');

  if (!localStorage.getItem('authToken')) {
    navigate('/login');
  }

    
    if (!token) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event("storage"));
      setError('❌ Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);



    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditToggle = async () => {
        if (editable) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.put('http://localhost:5000/api/user/update', user, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('✅ Profile updated');
            } catch (err) {
                console.error('❌ Failed to update profile', err);
                alert('❌ Update failed');
            }
        }
        setEditable(!editable);
    };

    const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  window.dispatchEvent(new Event("storage"));
  navigate('/');
};



    if (loading) return <div className="profile-container">Loading...</div>;
    if (error) return <div className="profile-container error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Welcome, {user.firstName} {user.lastName}</h2>
                <p>{new Date().toDateString()}</p>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">
                    <div className="profile-info">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>{user.email}</p>
                    </div>
                    <button onClick={handleEditToggle}>
                        {editable ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input name="firstName" value={user.firstName} onChange={handleChange} disabled={!editable} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input name="lastName" value={user.lastName} onChange={handleChange} disabled={!editable} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" value={user.email} disabled />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={user.phone} onChange={handleChange} disabled={!editable} />
                    </div>
                </div>
            </div>
        </div>
    );
}
