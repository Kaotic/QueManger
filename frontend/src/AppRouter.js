import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NoMatchScreen from './screens/NoMatchScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/User/LoginScreen';
import RegisterScreen from './screens/User/RegisterScreen';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout isProtected={true} />}>
                <Route index element={<HomeScreen />} />
            </Route>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="*" element={<NoMatchScreen />} />
        </Routes>
    );
}

export default AppRouter;
