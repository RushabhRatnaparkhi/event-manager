import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import api from '../../utils/axios.config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleGuestLogin = async () => {
    try {
      console.log('Attempting guest login');
      const response = await api.post('/auth/guest-login');
      console.log('Guest login response:', response);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Guest login error:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'An error occurred during guest login'
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
        
        <Box sx={{ my: 2 }}>
          <Divider>OR</Divider>
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleGuestLogin}
        >
          Guest Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login; 