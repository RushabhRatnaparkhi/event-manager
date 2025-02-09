import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  CardActionArea,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Default image if none is provided
  const defaultImage = 'https://via.placeholder.com/400x200?text=No+Image';

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="200"
          image={event.image?.url || defaultImage}
          alt={event.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" noWrap>
            {event.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(event.date), 'PPP')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {event.time}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Chip 
              label={event.category} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {event.description}
          </Typography>

          {event.status === 'cancelled' && (
            <Chip
              label="Cancelled"
              color="error"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          )}

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {event.attendees?.length || 0} attending
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard; 