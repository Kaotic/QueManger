import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { userLogout } from '../../redux/actions/userActions';

function Header() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(userLogout());
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                    QueManger
                </Typography>
                {user.isAuthenticated ? (
                    <div>
                        <Typography variant="subtitle1" style={{ marginRight: 20 }}>
                            Bonjour, {user.data?.name}
                        </Typography>
                        <Button variant="outlined" color="inherit" onClick={handleLogout}>
                            Se déconnecter
                        </Button>
                    </div>
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
