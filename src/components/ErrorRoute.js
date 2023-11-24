// components/ErrorRoute.js
import React from 'react';
import '../styles/ErrorRoute.css';

const ErrorRoute = () => (
  <div className="error-card">
    <p className='errorAPI'>Error: Either the route does not exist or an API error occurred.</p>
    <p>Please try again or navigate to the login page.</p>
  </div>
);

export default ErrorRoute;
