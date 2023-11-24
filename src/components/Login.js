// components/Login.js
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({auth}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  
  function handleLogin() {
    if (email) {
      // Store the user's email locally
      localStorage.setItem('UserDetails', JSON.stringify({ email: email }));
      auth(); // Trigger authentication logic if needed
      navigate('product-list');
    } else {
      // Handle invalid email case
      console.error('Invalid email');
    }
  }

  const handleSocialLogin = (provider, response) => {
    const userEmail = response.profileObj.email;

    // Check if the user is already authenticated
    if (!user) {
      // Store the user's email locally
      setUser({ email: userEmail });

      // Redirect to ProductList after successful login
      navigate('/product-list');
    } else {
      console.log('User is already authenticated');
    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form-container">
        <h2 className="LoginForm">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Login</button>
        </form>

        <div className="social-login">
          <p>Or login with:</p>

          <GoogleLogin
            clientId="284303644655-6f882m46vpam6seon830o8nuhgollktu.apps.googleusercontent.com"
            onSuccess={(response) => handleSocialLogin('Google', response)}
            onFailure={(response) => console.error(response)}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            uxMode={'popup'}
            redirectUri={'http://localhost:3000/product-list'}
            style={{ width: '100%' }}
          >
            Login with Google
          </GoogleLogin>
        </div>
      </div>
    </div>
  );
};

export default Login;
