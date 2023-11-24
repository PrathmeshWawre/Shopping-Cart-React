const initialState = {
  items: [],
  products: [], 
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'SET_PRODUCTS':
      // Update state with the received products
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
