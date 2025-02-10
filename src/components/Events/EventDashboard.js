import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import api from '../../utils/axios.config';
import EventCard from './EventCard';
import socket from '../../utils/socket.config';

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Connect to socket
    socket.connect();

    // Listen for event updates
    socket.on('event-updated', (updatedEvent) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on('event-created', (newEvent) => {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    });

    socket.on('event-deleted', (deletedEventId) => {
      setEvents(prevEvents => 
        prevEvents.filter(event => event._id !== deletedEventId)
      );
    });

    socket.on('event-cancelled', (updatedEvent) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup
    return () => {
      socket.off('event-updated');
      socket.off('event-created');
      socket.off('event-deleted');
      socket.off('event-cancelled');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventDashboard; 