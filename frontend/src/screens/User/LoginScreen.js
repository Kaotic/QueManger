import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Footer from '../../components/layouts/Footer';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/api';
import jwtDecode from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const [isLoading, setIsLoading] = React.useState(false);

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        if(username.length < 3 || password.length < 3) {
            enqueueSnackbar('Veuillez remplir tous les champs', { variant: 'error' });
            return;
        }

        setIsLoading(true);

        api.post('/api/token', {
            username: data.get('username'),
            password: data.get('password'),
        })
            .then((response) => {
                console.log(response);
                if(response.status === 200 && response.data.refresh && response.data.access){
                    let data = response.data;
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    dispatch({ type: 'USER_LOGIN', auth: { access: data.access, refresh: data.refresh }, username, payload: jwtDecode(data.access) });
                    enqueueSnackbar('Connexion réussie', { autoHideDuration: 1000, variant: 'success' });
                    navigate('/');
                }else{
                    enqueueSnackbar('Identifiants incorrects', { variant: 'error' });
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                enqueueSnackbar('Identifiants incorrects', { variant: 'error' });
                console.log(error);
                setIsLoading(false);
            });

    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Se connecter
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nom d'utilisateur"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Se souvenir de moi"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            Connexion
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Vous n'avez pas de compte? S'inscrire"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </div>
    );
}