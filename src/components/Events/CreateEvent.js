import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/axios.config';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, JPEG, and PNG files are allowed';
    }

    if (file.size > maxSize) {
      return 'File is too large. Maximum size is 5MB';
    }

    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setUploadError(error);
        setImage(null);
        setImagePreview(null);
        return;
      }

      setUploadError('');
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (image) {
        formDataToSend.append('image', image);
      }

      await api.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating event';
      setError(errorMessage);
      if (err.response?.status === 413) {
        setError('File size too large. Please upload a smaller image.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              required
              fullWidth
            />

            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              fullWidth
            />

            {/* Image Upload Section */}
            <Box sx={{ mt: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Event Image
              </Typography>
              <input
                accept="image/jpeg,image/jpg,image/png"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                disabled={loading}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                  fullWidth
                >
                  Upload Event Image
                </Button>
              </label>

              {uploadError && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {uploadError}
                </Typography>
              )}

              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '4px',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                    disabled={loading}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateEvent; 