import React from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const LoadingScreen = () => {
    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
                <Typography variant="h6" mt={2}>
                    Chargement...
                </Typography>
            </Box>
        </Container>
    );
}

export default LoadingScreen;
