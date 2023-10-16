import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NoMatchScreen from './screens/NoMatchScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/User/LoginScreen';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout isProtected={true} />}>
                <Route index component={HomeScreen} />
            </Route>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="*" element={<NoMatchScreen />} />
        </Routes>
    );
}

export default AppRouter;
