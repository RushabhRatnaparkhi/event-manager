const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const restrictGuest = require('../middleware/guestRestrictions');
const eventsController = require('../controllers/eventsController');

// Public routes (available to all users including guests)
router.get('/', auth, eventsController.getEvents);
router.get('/:id', auth, eventsController.getEvent);

// Protected routes (not available to guests)
router.post('/', [auth, restrictGuest], eventsController.createEvent);
router.put('/:id', [auth, restrictGuest], eventsController.updateEvent);
router.delete('/:id', [auth, restrictGuest], eventsController.deleteEvent);
router.post('/:id/attend', [auth, restrictGuest], eventsController.attendEvent);
router.post('/:id/unattend', [auth, restrictGuest], eventsController.unattendEvent);

// Event management routes
router.post('/:id/cancel', [auth, restrictGuest], eventsController.cancelEvent);
router.post('/:id/message', [auth, restrictGuest], eventsController.messageAttendees);
router.post('/:id/remove-attendee/:attendeeId', [auth, restrictGuest], eventsController.removeAttendee);

module.exports = router; 