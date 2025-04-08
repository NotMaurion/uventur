import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Box,
  IconButton,
  CardActions
} from '@mui/material';
import { 
  LocationOn, 
  AccessTime, 
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ListingGrid = ({ listings, onEdit, onDelete, isOwner = false }) => {
  const navigate = useNavigate();

  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  return (
    <Grid container spacing={3}>
      {listings.map((listing) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6
              }
            }}
            onClick={() => handleListingClick(listing.id)}
          >
            <CardMedia
              component="img"
              height="200"
              image={listing.images?.[0] || '/placeholder-image.jpg'}
              alt={listing.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2" noWrap>
                {listing.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {listing.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {listing.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(listing.availability.startDate), 'MMM d, yyyy')} - 
                  {format(new Date(listing.availability.endDate), 'MMM d, yyyy')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  ${listing.price}/day
                </Typography>
                <Chip 
                  label={listing.category} 
                  size="small" 
                  color="secondary"
                  sx={{ ml: 1 }}
                />
              </Box>
            </CardContent>
            {isOwner && (
              <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(listing);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(listing.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListingGrid; 