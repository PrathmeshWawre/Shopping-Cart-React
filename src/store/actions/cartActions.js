// cartActions.js
const ADD_TO_CART = 'ADD_TO_CART';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const SET_PRODUCTS = 'SET_PRODUCTS';

const addToCart = (payload) => ({ type: ADD_TO_CART, payload });
const incrementQuantity = (id) => ({ type: INCREMENT_QUANTITY, payload: { id} });
const decrementQuantity = (id) => ({ type: DECREMENT_QUANTITY, payload: { id } });
const removeFromCart = (id) => ({ type: REMOVE_FROM_CART, payload: { id } });
const setProducts = (products) => (dispatch) => {
  dispatch({ type: SET_PRODUCTS, payload: products });
};

export { addToCart, incrementQuantity, decrementQuantity, removeFromCart, setProducts };
