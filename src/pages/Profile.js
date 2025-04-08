import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Button,
  Avatar
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import ListingGrid from '../components/listing/ListingGrid';
import { getUserListings } from '../services/firestore';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listings = await getUserListings(currentUser.uid);
        setUserListings(listings);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserListings();
    }
  }, [currentUser]);

  const handleEditListing = (listing) => {
    // TODO: Implement edit functionality
    console.log('Edit listing:', listing);
  };

  const handleDeleteListing = async (listingId) => {
    // TODO: Implement delete functionality
    console.log('Delete listing:', listingId);
  };

  if (!currentUser) {
    return (
      <Container>
        <Typography variant="h5" component="h1" gutterBottom>
          Please log in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentUser.displayName || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {currentUser.email}
            </Typography>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        My Listings
      </Typography>
      
      {loading ? (
        <Typography>Loading your listings...</Typography>
      ) : userListings.length > 0 ? (
        <ListingGrid 
          listings={userListings}
          onEdit={handleEditListing}
          onDelete={handleDeleteListing}
          isOwner={true}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't created any listings yet.
          </Typography>
          <Button variant="contained" color="primary">
            Create Your First Listing
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Profile; 