// import { configureStore } from "@reduxjs/toolkit";
// import { thunk } from "redux-thunk";
// import productsReducer from "./slices/productsSlice";
// import { combineReducers } from "redux";
// import productReducer from './slices/productSlice';

// const reducer=combineReducers({
//    productsState:productsReducer,
//    productState:productReducer
// })




// const store = configureStore({
//   reducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
// });

// export default store;
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import productsReducer from "./slices/productsSlice";
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice'


const reducer = combineReducers({
    productsState: productsReducer,
    productState: productReducer ,
    authState: authReducer,
    cartState: cartReducer,
    orderState: orderReducer,
    userState: userReducer
})


const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export default store;