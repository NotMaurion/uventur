import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { 
  LocationOn, 
  AccessTime, 
  Person as PersonIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getListing } from '../services/firestore';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container>
        <Typography>Listing not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {listing.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={listing.category} color="primary" />
              <Chip label={`$${listing.price}/day`} color="secondary" />
            </Box>
            <Typography variant="body1" paragraph>
              {listing.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>{listing.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>
                {format(new Date(listing.availability.startDate), 'MMM d, yyyy')} - 
                {format(new Date(listing.availability.endDate), 'MMM d, yyyy')}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Images
            </Typography>
            <Grid container spacing={2}>
              {listing.images?.map((image, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <img 
                    src={image} 
                    alt={`${listing.title} - ${index + 1}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Owner Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>{listing.ownerName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>{listing.ownerEmail}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ mb: 2 }}
            >
              Contact Owner
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
            >
              Make a Reservation
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingDetails; 