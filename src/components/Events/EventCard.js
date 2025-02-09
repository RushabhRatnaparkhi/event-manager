import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Date: {format(new Date(event.date), 'PPP')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {event.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {event.location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {event.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Attendees: {event.attendees?.length || 0}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleClick}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard; 