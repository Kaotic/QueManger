import { useState } from 'react';
import { Container, IconButton, Typography } from '@mui/material';
import packageJson from '../../../package.json';
import AboutDialog from '../dialogs/AboutDialog';
import InfoIcon from '@mui/icons-material/Info';

function Footer() {
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

    const handleOpenAboutDialog = () => {
        setAboutDialogOpen(true);
    }

    return (
        <Container component="footer" maxWidth={false} style={{ marginTop: 'auto', padding: '1rem 1rem', backgroundColor: '#f5f5f5' }}>
            <AboutDialog open={aboutDialogOpen} setOpen={setAboutDialogOpen} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div>
                    <Typography variant="body1" align="center">
                        © 2023 QueManger. Tous droits vraiment pas réservés.
                    </Typography>
                    <Typography variant="body1" align="center" >
                        v{packageJson.version} by <a href="https://kaotic.fr/" target='_blank' rel="noopener noreferrer">Kaotic</a> | Recettes par <a href="https://www.marmiton.org/" target='_blank' rel="noopener noreferrer">Marmiton</a>
                    </Typography>
                </div>
                <div>
                    <IconButton onClick={handleOpenAboutDialog} size="large">
                        <InfoIcon />
                    </IconButton>
                </div>
            </div>
        </Container>
    );
}

export default Footer;
