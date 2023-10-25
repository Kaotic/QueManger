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

export default function RegisterScreen() {
    const [isLoading, setIsLoading] = React.useState(false);

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const email = data.get('email');
        const password = data.get('password');
        const password2 = data.get('password2');

        if(username.length < 3){
            enqueueSnackbar('Le nom d\'utilisateur doit contenir au moins 3 caractères', { variant: 'error' });
            return;
        }

        if(email.length < 3){
            enqueueSnackbar('L\'adresse email doit contenir au moins 3 caractères', { variant: 'error' });
            return;
        }

        if(password.length < 8){
            enqueueSnackbar('Le mot de passe doit contenir au moins 8 caractères', { variant: 'error' });
            return;
        }

        if(password !== password2){
            enqueueSnackbar('Les mots de passe ne correspondent pas', { variant: 'error' });
            return;
        }

        setIsLoading(true);

        api.post('/api/user/register', {
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
        })
            .then((response) => {
                if(response.status === 200 || response.status === 201){
                    let message = response.data?.message || 'Inscription réussie';
                    enqueueSnackbar(message, { autoHideDuration: 1000, variant: 'success' });
                    navigate('/login');
                }else if(response?.data?.error){
                    enqueueSnackbar(response.data.error, { variant: 'error' });
                    setIsLoading(false);
                }else{
                    enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                const errorMessage = error?.response?.data?.error || 'Une erreur est survenue';
                enqueueSnackbar(errorMessage, { variant: 'error' });
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
                        Inscription
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
                            id="email"
                            label="Adresse email"
                            name="email"
                            autoComplete="email"
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password2"
                            label="Confirmer le mot de passe"
                            type="password"
                            id="password2"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            S'inscrire
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Vous avez déjà un compte ? Se connecter"}
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