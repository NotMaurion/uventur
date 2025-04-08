import React, { useContext } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import ListingForm from '../components/listing/ListingForm';
import { createListing } from '../services/firestore';
import { useNavigate } from 'react-router-dom';

const ListingCreate = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const listingData = {
        ...values,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Anonymous',
        ownerEmail: currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };

      const { id } = await createListing(listingData);
      navigate(`/listings/${id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      // TODO: Add error handling/notification
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Listing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to create your listing
        </Typography>
      </Box>

      <ListingForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default ListingCreate; 