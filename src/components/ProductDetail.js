// components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/actions/cartActions';
import '../styles/ProductDetail.css';

const ProductDetail = ({ logoutx }) => {
  const { id } = useParams();
  const productId = String(id);
  const dispatch = useDispatch();
  const [user, setUser] = useState({ email: '' });
  const navigate = useNavigate();
  const [totalQuantityInCart, setTotalQuantityInCart] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productQuantities, setProductQuantities] = useState({});
  const [storedCartItems, setStoredCartItems] = useState([]);

  const products = useSelector((state) => state.cart.products);

  const productDetails = products.find((product) => String(product.id) === productId);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || {};
    const storedCartItems = Array.isArray(storedData.cartItems) ? storedData.cartItems : [];
  
    const uniqueProductIds = new Set(
      storedCartItems.map((item) => item.productId)
    );
  
    const totalQuantity = uniqueProductIds.size;
  
    setTotalQuantityInCart(totalQuantity);
  }, [user.email]);
  
  // Added another useEffect to update the user state when there's a change in local storage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || {};
    setUser({ email: storedData.email || '' });
  }, [localStorage.getItem('UserDetails').cartItems]);
  

  const handleIncrement = (productId) => {
    // Retrieve cart items from local storage
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || { cartItems: [] };
    const cartItems = storedData.cartItems || [];
  
    // Increment the quantity for the specific product
    const updatedCartItems = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: (item.quantity || 0) + 1 };
      }
      return item;
    });
  
    // Update local storage with the modified cart items
    localStorage.setItem('UserDetails', JSON.stringify({ ...storedData, cartItems: updatedCartItems }));
  
    // Update the local state for display purposes
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  
    // Update total quantity in the cart
    updateTotalQuantity();
  };

  const handleDecrement = (productId) => {
    // Convert productId to a number
    const numericProductId = Number(productId);
  
    // Retrieve cart items from local storage
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || { cartItems: [] };
  
    // Decrement the quantity for the specific product, ensuring it doesn't go below 0
    const updatedCartItems = storedData.cartItems
      .map(item => {
        if (item.productId === numericProductId) {
          return { ...item, quantity: Math.max((item.quantity || 0) - 1, 0) };
        }
        return item;
      })
      .filter(item => item.quantity > 0); // Remove items with quantity 0
  
    // Update local storage with the modified cart items
    localStorage.setItem('UserDetails', JSON.stringify({ ...storedData, cartItems: updatedCartItems }));
  
    // Update the local state for display purposes
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [numericProductId]: Math.max((prevQuantities[numericProductId] || 0) - 1, 0),
    }));
  
    // Update total quantity in the cart
    updateTotalQuantity();
  };
  

  const handleAddToCart = (productId) => {
    // Get the current quantity for the specific product
    const quantityToAdd = productQuantities[productId] || 0;
  
    // Check if the quantity is greater than 0 and the product is not already in the cart
    if (quantityToAdd > 0) {
      // Get the current stored cart items from localStorage
      const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
      const existingCartItems = userDetails.cartItems || [];
  
      // // Check if the product is already in the cart
      const existingItemIndex = existingCartItems.findIndex((item) => item.productId === Number(productId));
  
      const newStoredCartItems = [...existingCartItems];
  
      if (existingItemIndex === -1) {
        // Add a new item if it doesn't exist in localStorage
        newStoredCartItems.push({ productId: Number(productId), quantity: quantityToAdd });
      } else {
        // Increment the quantity if the item already exists in localStorage
        newStoredCartItems[existingItemIndex].quantity += quantityToAdd;
      }
  
      // Update local storage with the modified cart items in UserDetails
      localStorage.setItem('UserDetails', JSON.stringify({ ...userDetails, cartItems: newStoredCartItems }));
  
      // Set the new storedCartItems state
      setStoredCartItems(newStoredCartItems);
  
      // Update total quantity in the cart
      updateTotalQuantity();
    }
  };
  

  const renderStars = (rating) => {
    const starIcons = [];
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < filledStars; i++) {
      starIcons.push(<span key={i} className="star"></span>);
    }

    if (hasHalfStar) {
      starIcons.push(<span key="half" className="half-star"></span>);
    }

    const remainingStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      starIcons.push(<span key={`empty-${i}`} className="star"></span>);
    }

    return starIcons;
  };

  const updateTotalQuantity = () => {
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || {};
    const storedCartItems = Array.isArray(storedData.cartItems) ? storedData.cartItems : [];

    const uniqueProductIds = new Set(
      storedCartItems.map((item) => item.productId)
    );

    const totalQuantity = uniqueProductIds.size;

    setTotalQuantityInCart(totalQuantity);
  };

  const handleLogout = () => {
    localStorage.removeItem('UserDetails');
    logoutx();
    navigate('/login');
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images } = productDetails;

  const discountedPrice = price - (price * (discountPercentage / 100));

  return (
    <div>
      <div className="top-bar">
        <img className="logo" src="../shopping.png" alt="Website Logo" />
        <div className="user-inffo">
          <p>Welcome, {user && user.email ? user.email.split('@')[0] : 'Unknown User'}</p>
          <Link to="/product-list">
            <button className="go-to-list-button">Go to List</button>
          </Link>
        </div>
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
        <Link to="/cart" className="cart-icon">
          🛒 {totalQuantityInCart}
        </Link>
      </div>

      <div className="product-details-container">
        <h2 className="product-details-title">{title}</h2>
        <div className="product-details-info">
          <img
            className="product-details-thumbnail"
            src={thumbnail}
            alt={title}
          />
          <div className="product-details-description">
            <p>{description}</p>
            <p className="product-details-price">
              <span className="discount-percentage">-{discountPercentage}%</span>
              <span className="discounted-price"> ₹{discountedPrice.toFixed(2)}</span>
              <span className="original-price">
                <del>M.R.P.: ₹{price.toFixed(2)}</del>
              </span>
            </p>
            <p className="product-details-rating">
              {renderStars(rating)}
            </p>
            <p className="product-details-stock">Available Quantity: {stock}</p>
            <p className="product-details-brand">Brand: {brand}</p>
            <p className="product-details-category">Category: {category}</p>
            <div className="quantity-control">
              <button
                className="quantity-button"
                onClick={() => handleDecrement(productId)}
              >
                -
              </button>
              <span className="quantity">
                {productQuantities[productId] || 0}
              </span>
              <button
                className="quantity-button"
                onClick={() => handleIncrement(productId)}
              >
                +
              </button>
            </div>
            <button
              className="addToCartText"
              onClick={() => handleAddToCart(productId)}
            >
              Add To Cart
            </button>
          </div>
        </div>
        <div className="product-details-images">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Product Image ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

