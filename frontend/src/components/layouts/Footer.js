import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import packageJson from '../../../package.json';

function Footer() {
    return (
        <Container component="footer" maxWidth={false} style={{ marginTop: 'auto', padding: '2rem 0', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" align="center">
                © 2023 QueManger. Tous droits vraiment pas réservés.
            </Typography>
            <Typography variant="body1" align="center">
                v{packageJson.version} by <a href="https://kaotic.fr/" target='_blank' rel="noopener noreferrer">Kaotic</a> | Recettes par <a href="https://www.marmiton.org/" target='_blank' rel="noopener noreferrer">Marmiton</a>
            </Typography>
        </Container>
    );
}

export default Footer;
