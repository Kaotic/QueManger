import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import HeaderUserButton from './HeaderUserButton';

function Header() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    QueManger
                </Typography>
                {user.isAuthenticated ? (
                    <HeaderUserButton />
                ) : (
                    <Button variant="outlined" color="inherit">
                        Se connecter
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
