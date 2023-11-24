// components/ProductList.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ProductList.css';
import { useNavigate } from 'react-router-dom';
import { incrementQuantity, setProducts } from '../store/actions/cartActions';

const ProductList = ({ logoutx }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [totalQuantityInCart, setTotalQuantityInCart] = useState(0);
  const [user, setUser] = useState({ email: '' }); // Initialize user as an object
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [firstTenProducts, setFirstTenProducts] = useState([]);
  const [storedCartItems, setStoredCartItems] = useState([]);

  // Access the products from the Redux store
  const products = useSelector((state) => state.cart.products);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch products only if not available in the Redux store
    if (!products || products.length === 0) {
      axios
        .get('https://dummyjson.com/products')
        .then((response) => {
          if (!response.data || !Array.isArray(response.data.products)) {
            throw new Error('Invalid response data or missing products array.');
          }

          // Store only the first 10 products in the Redux store
          const fetchedProducts = response.data.products.slice(0, 10);
          setFirstTenProducts(fetchedProducts);

          // Add 'quantity' key with an initial value of 0 to each product
          const productsWithQuantity = fetchedProducts.map((product) => ({
            ...product,
            quantity: 0,
          }));

          dispatch(setProducts(productsWithQuantity));

          console.log('Initial Products with Quantity:', productsWithQuantity);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setError('Error fetching products. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, products]);

  useEffect(() => {
    // Update product quantities from Redux store
    const productQuantities = cartItems.reduce((quantities, item) => {
      quantities[item.id] = item.quantity;
      return quantities;
    }, {});
    setProductQuantities(productQuantities);
  }, [cartItems]);

  useEffect(() => {
    const userLogin = localStorage.getItem('login');
    setUser(userLogin ? { email: userLogin } : { email: '' });
  }, []);

  useEffect(() => {
    const userEmail = getEmailFromLocalStorage();
    setUser(userEmail ? { email: userEmail } : { email: '' });
  }, []);

  useEffect(() => {
    // Load product quantities from localStorage on component mount
    const storedData = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
    const storedCartItems = Array.isArray(storedData.cartItems) ? storedData.cartItems : [];

    // Get the unique product IDs in the cart
    const uniqueProductIds = new Set(
      storedCartItems.map((item) => item.productId)
    );

    // Calculate the total quantity by counting the number of unique products
    const totalQuantity = uniqueProductIds.size;

    setTotalQuantityInCart(totalQuantity);
  }, [user.email, cartItems]);

  const getEmailFromLocalStorage = () => {
    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: '' };
    return userDetails.email;
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

  const handleIncrement = (productId) => {
    // Get the current stored cart items from localStorage
    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
    const existingCartItems = userDetails.cartItems || [];
  
    // Increment the quantity for the specific product
    const updatedCartItems = existingCartItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: (item.quantity || 0) + 1 };
      }
      return item;
    });
  
    // Update local storage with the modified cart items in UserDetails
    localStorage.setItem('UserDetails', JSON.stringify({ ...userDetails, cartItems: updatedCartItems }));
  
    // Update the local state for display purposes
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  
    // Update total quantity in the cart
    updateTotalQuantity();
  };
  
  const handleDecrement = (productId) => {
    // Get the current stored cart items from localStorage
    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
    const existingCartItems = userDetails.cartItems || [];
  
    // Decrement the quantity for the specific product, ensuring it doesn't go below 0
    const updatedCartItems = existingCartItems
      .map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: Math.max((item.quantity || 0) - 1, 0) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
  
    // Update local storage with the modified cart items in UserDetails
    localStorage.setItem('UserDetails', JSON.stringify({ ...userDetails, cartItems: updatedCartItems }));
  
    // Update the local state for display purposes
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0),
    }));
  
    // Update total quantity in the cart
    updateTotalQuantity();
  };
  

  const updateTotalQuantity = () => {
    // Load UserDetails from localStorage
    const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
    const storedCartItems = Array.isArray(userDetails.cartItems) ? userDetails.cartItems : [];
  
    // Get the unique product IDs in the cart
    const uniqueProductIds = new Set(
      storedCartItems.map((item) => item.productId)
    );
  
    // Calculate the total quantity by counting the number of unique products
    const totalQuantity = uniqueProductIds.size;
  
    setTotalQuantityInCart(totalQuantity);
  };

  const handleAddToCart = (productId) => {
    // Get the current quantity for the specific product
    const quantityToAdd = productQuantities[productId] || 0;
  
    // Check if the quantity is greater than 0 and the product is not already in the cart
    if (quantityToAdd > 0) {
      // Get the current stored cart items from localStorage
      const userDetails = JSON.parse(localStorage.getItem('UserDetails')) || { email: user.email, cartItems: [] };
      const existingCartItems = userDetails.cartItems || [];
  
      // Check if the product is already in the cart
      const existingItemIndex = existingCartItems.findIndex((item) => item.productId === productId);
  
      const newStoredCartItems = [...existingCartItems];
  
      if (existingItemIndex === -1) {
        // Add a new item if it doesn't exist in localStorage
        newStoredCartItems.push({ productId, quantity: quantityToAdd });
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
  
  // Use useEffect to log the updated products after the state has been updated
  useEffect(() => {
    // Only run the effect when both storedCartItems and firstTenProducts are available
    if (storedCartItems.length > 0 && firstTenProducts.length > 0) {
      const updatedProducts = firstTenProducts.map((product) => ({
        ...product,
        quantity: storedCartItems.find((item) => item.productId === product.id)?.quantity || 0,
      }));
      console.log('Updated Products:', updatedProducts);
    }
  }, [storedCartItems, firstTenProducts]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleLogout() {
    // Clear cart items in local storage for the current user
    localStorage.removeItem(`UserDetails`);
    logoutx();
    navigate('login');
  }

  return (
    <div>
      <div className="ListScreen">
        <img className="logo" src="../shopping.png" alt="Website Logo" />
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="user-info">
            <p>
              Welcome,{' '}
              {user && typeof user.email === 'string'
                ? user.email.split('@')[0]
                : 'Unknown User'}
            </p>
          </div>
          <div className="logoutButton">
            <button className="logoutButtonn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <Link to="/cart" className="cart-icon">
        🛒 {totalQuantityInCart}
      </Link>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  className="thumbnail"
                  src={product.thumbnail}
                  alt={product.title}
                />
                <div className="product-info">
                  <h3 className="product-titlee">{product.title}</h3>
                  <p className="price">
                    <span className="discount-percentage">
                      -{product.discountPercentage}%
                    </span>
                    <span className="discounted-pricee">
                      ${(
                        product.price -
                        (product.price * (product.discountPercentage / 100)).toFixed(
                          2
                        )
                      ).toFixed(2)}
                    </span>
                    <span className="original-price">
                      <del>M.R.P.: ${product.price.toFixed(2)}</del>
                    </span>
                  </p>
                  <p className="rating">{renderStars(product.rating)}</p>
                  <p className="brandd">Brand: {product.brand}</p>
                </div>
              </Link>
              <div className="quantity-control">
                <button
                  className="quantity-button"
                  onClick={() => handleDecrement(product.id)}
                >
                  -
                </button>
                <span className="quantityy">
                  {productQuantities[product.id] || 0}
                </span>
                <button
                  className="quantity-button"
                  onClick={() => handleIncrement(product.id)}
                >
                  +
                </button>
              </div>
              <button
                className="addToCartText"
                onClick={() => handleAddToCart(product.id)}
              >
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
