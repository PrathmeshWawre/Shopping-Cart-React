// components/Cart.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../store/actions/cartActions';
import axios from 'axios';
import '../styles/Cart.css';
import { useNavigate, Link } from 'react-router-dom';

const Cart = ({ logoutx }) => {
  const dispatch = useDispatch();
  const [localCartItems, setLocalCartItems] = useState([]);
  const { navigate } = useNavigate();
  const [user, setUser] = useState({ email: '' });

  useEffect(() => {
    // Fetch user details from local storage
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || {};
    const storedUser = { email: storedData.email || '' };

    setUser(storedUser);

    const fetchProductDetails = async () => {
      if (storedUser && storedUser.email) {
        const storedCartItems = storedData.cartItems || [];

        // Fetch details for each product in the cart
        const updatedCartItems = await Promise.all(
          storedCartItems.map(async (item) => {
            try {
              const response = await axios.get(`https://dummyjson.com/products/${item.productId}`);
              const productDetails = response.data;
              return {
                ...item,
                ...productDetails,
              };
            } catch (error) {
              console.error(`Error fetching product details for productId ${item.productId}:`, error);
              return item;
            }
          })
        );

        // Updating local state with product details
        setLocalCartItems(updatedCartItems);
      }
    };

    fetchProductDetails();
  }, []);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));

    // Update quantity in local state
    const updatedCartItems = localCartItems
      .map((item) => {
        if (item.productId === productId && item.quantity > 0) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    // Update quantity in local storage
    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
    userDetails.cartItems = updatedCartItems;
    localStorage.setItem('UserDetails', JSON.stringify(userDetails));

    setLocalCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    return localCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleLogout = () => {
    // Clear user details and cart items in local storage
    localStorage.removeItem('UserDetails');
    logoutx();
    navigate('/login');
  };

  return (
    <div>
      <div className='navbar'>
        <img className="logoo" src="../shopping.png" alt="Website Logo" />
        <div className="user-infoo">
          <p>Welcome, {user && user.email ? user.email.split('@')[0] : 'Unknown User'}</p>
        </div>
        <Link to="/product-list">
            <p className="go-to-list-buttoon">Go to List</p>
          </Link>

        <div className='logoutButtoon'>
          <button className='logoutButtonn' onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="cart-container">
        <h1>Your Cart</h1>
        {localCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {localCartItems.map((cartItem) => (
                <li key={cartItem.productId} className="cart-item">
                  <div className="thumbnail">
                    <img src={cartItem.thumbnail} alt={cartItem.title} />
                  </div>
                  <div className="details">
                    <p className="title">{cartItem.title}</p>
                    <p className="brand">Brand: {cartItem.brand}</p>
                    <p className="description">{cartItem.description}</p>
                    <p className="quantity">Quantity: {cartItem.quantity}</p>
                    <p className="price">Price: ${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
                    <button className='removeItem' onClick={() => handleRemoveFromCart(cartItem.productId)}>
                      Remove from Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <p>Total Products: {localCartItems.length}</p>
              <p>Total Price: ₹{calculateTotalPrice().toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
