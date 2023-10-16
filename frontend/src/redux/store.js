import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './reducers/userReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer
    }
});

export default store;
