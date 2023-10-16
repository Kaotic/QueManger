import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function HomeScreen() {
  return (
    <div className="home-screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container component="main" maxWidth="lg" style={{ flexGrow: 1, padding: '2rem 0' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenue sur QueManger!
        </Typography>
        {/* Vous pouvez ajouter d'autres composants ou contenu ici */}
      </Container>
    </div>
  );
}

export default HomeScreen;
