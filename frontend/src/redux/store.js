import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import shopListReducer from './reducers/shopListReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        shopList: shopListReducer,
    }
});

export default store;
