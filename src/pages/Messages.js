import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Messages = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Message functionality coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default Messages; 