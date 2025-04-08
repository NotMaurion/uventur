import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../../context/AuthContext';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title should be at least 5 characters')
    .max(100, 'Title should not exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description should be at least 20 characters')
    .max(1000, 'Description should not exceed 1000 characters'),
  category: Yup.string()
    .required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be greater than or equal to 0'),
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

const ListingForm = ({ initialValues, onSubmit }) => {
  const { currentUser } = useContext(AuthContext);
  const [images, setImages] = useState([]);

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      category: '',
      price: '',
      location: '',
      availability: {
        startDate: new Date(),
        endDate: new Date()
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        ...values,
        images,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || 'Anonymous',
        ownerEmail: currentUser.email
      };
      await onSubmit(formData);
    }
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // TODO: Implement image upload to Firebase Storage
    setImages(files);
  };

  return (
    <Paper sx={{ p: 3 }}>
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
              <InputLabel>Category</InputLabel>
              <Select
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="vehicles">Vehicles</MenuItem>
                <MenuItem value="gear">Gear</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
              </Select>
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
            <Typography gutterBottom>Start Date</Typography>
            <DatePicker
              selected={formik.values.availability.startDate}
              onChange={(date) => formik.setFieldValue('availability.startDate', date)}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>End Date</Typography>
            <DatePicker
              selected={formik.values.availability.endDate}
              onChange={(date) => formik.setFieldValue('availability.endDate', date)}
              minDate={formik.values.availability.startDate}
              dateFormat="MMMM d, yyyy"
            />
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                Upload Images
              </Button>
            </label>
            {images.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {images.length} image(s) selected
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ListingForm; 