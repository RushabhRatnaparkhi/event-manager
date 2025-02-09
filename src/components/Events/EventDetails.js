import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  Divider,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Mail as MailIcon,
  PersonRemove as PersonRemoveIcon,
  EventBusy as EventBusyIcon,
  Share as ShareIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import api from '../../utils/axios.config';
import { useAuth } from '../../contexts/AuthContext';
import socket from '../../utils/socket.config';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attending, setAttending] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        console.log('Event data:', response.data);
        console.log('Current user:', user);
        setEvent(response.data);
        setAttending(response.data.attendees.some(
          attendee => attendee._id === user?.id
        ));
        setEditFormData({
          title: response.data.title,
          description: response.data.description,
          date: response.data.date.split('T')[0],
          time: response.data.time,
          location: response.data.location,
          category: response.data.category,
        });
        console.log('Is owner:', response.data.creator._id === user?.id);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEvent();

    // Socket.IO setup
    socket.connect();
    socket.emit('join-event', id);

    // Listen for attendees updates
    socket.on('attendees-updated', (updatedAttendees) => {
      setEvent(prev => ({
        ...prev,
        attendees: updatedAttendees
      }));
      setAttending(updatedAttendees.some(
        attendee => attendee._id === user?.id
      ));
    });

    return () => {
      socket.emit('leave-event', id);
      socket.off('attendees-updated');
      socket.disconnect();
    };
  }, [id, user]);

  const isEventOwner = user && event && event.creator._id === user.id;

  const handleAttendance = async () => {
    if (user?.isGuest) {
      setError('Guest users cannot attend events. Please register for full access.');
      return;
    }

    try {
      const endpoint = attending ? 'unattend' : 'attend';
      const response = await api.post(`/events/${id}/${endpoint}`);
      setEvent(response.data);
      setAttending(!attending);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance');
    }
  };

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
        setEditImage(null);
        setEditImagePreview(null);
        return;
      }

      setUploadError('');
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach(key => {
        formData.append(key, editFormData[key]);
      });

      if (editImage) {
        formData.append('image', editImage);
      }

      const response = await api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setEvent(response.data);
      setEditDialogOpen(false);
      setEditImage(null);
      setEditImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await api.delete(`/events/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttendeeMenuOpen = (event, attendee) => {
    setAnchorEl(event.currentTarget);
    setSelectedAttendee(attendee);
  };

  const handleAttendeeMenuClose = () => {
    setAnchorEl(null);
    setSelectedAttendee(null);
  };

  const handleRemoveAttendee = async () => {
    try {
      await api.post(`/events/${id}/remove-attendee/${selectedAttendee._id}`);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      handleAttendeeMenuClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove attendee');
    }
  };

  const handleCancelEvent = async () => {
    try {
      await api.post(`/events/${id}/cancel`);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      setCancelDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel event');
    }
  };

  const handleMessageAttendees = async () => {
    try {
      await api.post(`/events/${id}/message`, { message });
      setMessageDialogOpen(false);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleShareEvent = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShareDialogOpen(false);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Box display="flex" justifyContent="center" mt={4}><Typography color="error">{error}</Typography></Box>;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        {/* Event Owner Controls */}
        {isEventOwner && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
            <Button
              startIcon={<ShareIcon />}
              onClick={() => setShareDialogOpen(true)}
              color="primary"
            >
              Share
            </Button>
            <Button
              startIcon={<MailIcon />}
              onClick={() => setMessageDialogOpen(true)}
              color="primary"
            >
              Message All
            </Button>
            <IconButton onClick={() => setEditDialogOpen(true)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setCancelDialogOpen(true)} color="warning">
              <EventBusyIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        )}

        {/* Event Status */}
        {event.status === 'cancelled' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            This event has been cancelled
          </Alert>
        )}

        <Typography variant="h4" component="h1" gutterBottom>
          {event.title}
        </Typography>
        {event.image && (
          <Box sx={{ mt: 2, mb: 4 }}>
            <img
              src={event.image.url}
              alt={event.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Details</Typography>
          <Typography>Date: {new Date(event.date).toLocaleDateString()}</Typography>
          <Typography>Time: {event.time}</Typography>
          <Typography>Location: {event.location}</Typography>
          <Typography>Category: {event.category}</Typography>
          {isEventOwner && (
            <Typography sx={{ mt: 1, color: 'primary.main' }}>
              You are the owner of this event
            </Typography>
          )}
        </Box>
        
        {/* Attendance Controls */}
        {user?.isGuest ? (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="warning.dark" gutterBottom>
              Guest User Restrictions
            </Typography>
            <Typography variant="body2" color="warning.dark">
              • Cannot attend events<br />
              • Cannot create events<br />
              • Cannot edit events<br />
              • Limited to viewing only<br />
              Please register for full access to all features.
            </Typography>
          </Box>
        ) : (
          user && !isEventOwner && (
            <Button
              variant="contained"
              color={attending ? "secondary" : "primary"}
              onClick={handleAttendance}
              sx={{ mt: 3 }}
            >
              {attending ? 'Cancel Attendance' : 'Attend Event'}
            </Button>
          )
        )}

        {/* Attendees List with Management */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Attendees ({event.attendees?.length || 0})
          </Typography>
          <List>
            {event.attendees?.map((attendee) => (
              <React.Fragment key={attendee._id}>
                <ListItem
                  secondaryAction={
                    isEventOwner && (
                      <IconButton onClick={(e) => handleAttendeeMenuOpen(e, attendee)}>
                        <MoreVertIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText 
                    primary={attendee.name}
                    secondary={attendee.email}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Attendee Management Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAttendeeMenuClose}
        >
          <MenuItem onClick={handleRemoveAttendee}>
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            Remove Attendee
          </MenuItem>
          <MenuItem onClick={() => {
            setMessageDialogOpen(true);
            handleAttendeeMenuClose();
          }}>
            <ListItemIcon>
              <MailIcon fontSize="small" />
            </ListItemIcon>
            Message Attendee
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                value={editFormData.date}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Time"
                name="time"
                type="time"
                value={editFormData.time}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={editFormData.location}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Category"
                name="category"
                value={editFormData.category}
                onChange={handleEditChange}
                fullWidth
              />
              {/* Image Upload Section */}
              <Box sx={{ mt: 2, border: '1px dashed grey', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Event Image
                </Typography>
                
                {/* Current Image Preview */}
                {!editImagePreview && event.image && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Current Image:
                    </Typography>
                    <img
                      src={event.image.url}
                      alt="Current event"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                )}

                {/* Image Upload Input */}
                <input
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: 'none' }}
                  id="edit-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="edit-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    {event.image ? 'Change Image' : 'Upload Image'}
                  </Button>
                </label>

                {uploadError && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {uploadError}
                  </Typography>
                )}

                {/* New Image Preview */}
                {editImagePreview && (
                  <Box sx={{ mt: 2, position: 'relative' }}>
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        setEditImage(null);
                        setEditImagePreview(null);
                      }}
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setEditDialogOpen(false);
                setEditImage(null);
                setEditImagePreview(null);
                setUploadError('');
              }}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained"
              disabled={editLoading}
            >
              {editLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this event? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteEvent} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Event Dialog */}
        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Cancel Event</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this event? All attendees will be notified.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Event</Button>
            <Button onClick={handleCancelEvent} color="warning" variant="contained">
              Yes, Cancel Event
            </Button>
          </DialogActions>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)} fullWidth>
          <DialogTitle>Send Message to Attendees</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMessageAttendees} variant="contained">
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
          <DialogTitle>Share Event</DialogTitle>
          <DialogContent>
            <Typography>
              Copy the event link to share with others:
            </Typography>
            <TextField
              fullWidth
              value={window.location.href}
              sx={{ mt: 2 }}
              InputProps={{
                readOnly: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
            <Button onClick={handleShareEvent} variant="contained">
              Copy Link
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EventDetails; 