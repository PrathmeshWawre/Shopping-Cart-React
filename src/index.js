// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider
import store from './store/store';
import App from './App';

// ReactDOM.render(
//   <Router>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </Router>,
//   document.getElementById('root')
// );


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
       <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
  ,
  document.getElementById('root')
);