import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createListing, updateListing, uploadMultipleImages } from '../../services/firestore';
import { uploadImage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

const categories = [
  'Tents',
  'Sleeping Bags',
  'Backpacks',
  'Hiking Boots',
  'Climbing Gear',
  'Camping Stoves',
  'Camping Chairs',
  'Camping Tables',
  'Camping Lanterns',
  'Camping Hammocks',
  'Camping Tarps',
  'Camping Coolers',
  'Camping First Aid Kits',
  'Camping Tools',
  'Other'
];

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  category: Yup.string()
    .required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive'),
  location: Yup.string()
    .required('Location is required'),
  availability: Yup.object({
    startDate: Yup.date()
      .required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
  })
});

const ListingForm = ({ listing, isEdit = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(listing?.images || []);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      title: listing?.title || '',
      description: listing?.description || '',
      category: listing?.category || '',
      price: listing?.price || '',
      location: listing?.location || '',
      availability: {
        startDate: listing?.availability?.startDate || '',
        endDate: listing?.availability?.endDate || ''
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        // Upload images if there are any
        let uploadedImageUrls = imageUrls;
        if (images.length > 0) {
          const uploadPromises = images.map(file => 
            uploadImage(file, `listings/${currentUser.uid}/${Date.now()}_${file.name}`)
          );
          uploadedImageUrls = await Promise.all(uploadPromises);
        }

        const listingData = {
          ...values,
          images: uploadedImageUrls,
          ownerId: currentUser.uid,
          ownerName: currentUser.displayName,
          ownerPhotoURL: currentUser.photoURL,
          createdAt: isEdit ? listing.createdAt : new Date(),
          updatedAt: new Date()
        };

        if (isEdit) {
          await updateListing(listing.id, listingData);
        } else {
          await createListing(listingData);
        }

        navigate('/my-listings');
      } catch (err) {
        console.error('Error saving listing:', err);
        setError('Failed to save listing. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageUrl = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Listing' : 'Create New Listing'}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <Typography color="error" variant="caption">
                  {formik.errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Price per day"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{
                startAdornment: <Typography>$</Typography>
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="availability.startDate"
              name="availability.startDate"
              label="Available from"
              type="date"
              value={formik.values.availability.startDate}
              onChange={formik.handleChange}
              error={formik.touched.availability?.startDate && Boolean(formik.errors.availability?.startDate)}
              helperText={formik.touched.availability?.startDate && formik.errors.availability?.startDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="availability.endDate"
              name="availability.endDate"
              label="Available until"
              type="date"
              value={formik.values.availability.endDate}
              onChange={formik.handleChange}
              error={formik.touched.availability?.endDate && Boolean(formik.errors.availability?.endDate)}
              helperText={formik.touched.availability?.endDate && formik.errors.availability?.endDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Images
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span">
                Upload Images
              </Button>
            </label>
          </Grid>

          {/* Display existing images */}
          {imageUrls.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Existing Images
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {imageUrls.map((url, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img 
                      src={url} 
                      alt={`Listing ${index + 1}`} 
                      style={{ width: 100, height: 100, objectFit: 'cover' }} 
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeImageUrl(index)}
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          {/* Display new images */}
          {images.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                New Images
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {images.map((file, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New upload ${index + 1}`} 
                      style={{ width: 100, height: 100, objectFit: 'cover' }} 
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : isEdit ? 'Update Listing' : 'Create Listing'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ListingForm; 