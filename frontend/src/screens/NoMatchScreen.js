import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function NoMatchScreen() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
			<Typography variant="h1">404</Typography>
			<Typography variant="h2">Page non trouvée</Typography>
			<Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Retour à l'accueil</Button>
		</Box>
	);
}

export default NoMatchScreen;