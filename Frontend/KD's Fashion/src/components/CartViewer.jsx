import React, { useEffect, useState } from 'react';
import './CartViewer.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import QRCode from 'qrcode';




export default function CartViewer() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
  const grandTotal = (subtotal + tax).toFixed(2);

  useEffect(() => {
  if (showQR) {
    const qrValue = `upi://pay?pa=dhrumilkorat81@oksbi&pn=KD's Fashion&am=${grandTotal}&cu=INR&tn=Payment for order by ${user.email}`;
    QRCode.toDataURL(qrValue, {
      color: {
        dark: '#00ffcc',
        light: '#000000',
      },
      margin: 2,
      width: 240,
    }).then(url => {
      setQrImage(url);
    }).catch(err => console.error('QR generation failed:', err));
  }
}, [showQR, grandTotal, user]);



  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/user/${user.email}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchCart();
  }, [user]);

  const handleQtyChange = async (id, newQty) => {
    if (newQty < 1) return;
    await axios.put(`http://localhost:5000/api/cart/update/${id}`, { quantity: newQty });
    fetchCart();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this item?")) {
      await axios.delete(`http://localhost:5000/api/cart/delete/${id}`);
      fetchCart();
    }
  };


  if (loading) return <div className="cart-loading">Loading your cart...</div>;

  return (
    <div className="cart-main" style={{marginTop: '150px' , marginBottom: '100px'}}>

    <div className="cart-wrapper">
      <h2 className="cart-title">🛒 Your Cart ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</h2>

      {cartItems.length === 0 ? (
          <p className="empty">Your cart is empty</p>
        ) : (
            <>
          <div className="cart-table">
            {cartItems.map((item, idx) => (
                <motion.div
                key={item._id}
                className="cart-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                >
                <img className="thumb" src={item.snapshots?.front} alt="shirt" />
                <div className="cart-details">
                  <h3>Size: {item.size}</h3>
                  <p>Price: ₹{item.image ? item.price : item.totalPrice}</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => handleQtyChange(item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item._id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-total">₹{((item.image ? item.price : item.totalPrice) * item.quantity).toFixed(2)}</div>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  <FaTrashAlt />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="cart-summary" >
            <div className="line"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="line"><span>Sales Tax (10%):</span><span>₹{tax}</span></div>
            <div className="line total"><span>Grand Total:</span><span>₹{grandTotal}</span></div>
            <button className="checkout-btn" onClick={() => setShowQR(true)}>
  Proceed to Checkout
</button>

          </div>

          {showQR && (
  <div className="qr-payment" style={{ marginTop: '40px', textAlign: 'center' }}>
    <h3 style={{ color: '#00ffcc' }}>Scan to Pay</h3>
    {qrImage ? (
      <img src={qrImage} alt="QR for Payment" width={240} height={240} />
    ) : (
      <p style={{ color: '#aaa' }}>Generating QR...</p>
    )}
    <p style={{ color: '#ccc', marginTop: '10px' }}>Total: ₹{grandTotal}</p>
    <p style={{ fontSize: '14px', color: '#aaa' }}>* This is a demo QR. No real payment gateway is connected.</p>
  </div>
)}


        </>
      )}
    </div>
      </div>
  );
}
