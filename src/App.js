// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const userLogin = localStorage.getItem('login');
    setUser(userLogin === 'true'); // Convert the string to a boolean
  }, []);

  useEffect(() => {
    localStorage.setItem('login', user);
  }, [user]);

  const logout = () => {
    setUser(false);
  };

  const auth = () => {
    setUser(true);
  };
  
  return (
    <div className='App'>
      <Routes>
        {!user && <Route path='/login' element={<Login auth={auth} />} />}
        {user && (
          <>
            <Route path="/product-list" element={<ProductList logoutx={logout} />} />
            <Route path='/product/:id' element={<ProductDetail logoutx={logout} />} />
            <Route path='/cart' element={<Cart logoutx={logout} />} />
          </>
        )}
        <Route path='*' element={<Navigate to={user ? 'product-list' : 'login'} />} />
      </Routes>
    </div>
  );
}

export default App;
