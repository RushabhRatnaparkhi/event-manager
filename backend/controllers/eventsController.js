const Event = require('../models/Event');
const socketUtil = require('../utils/socket');

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name email');
      
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create event
const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      creator: req.user.id
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user owns event
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Make sure user owns event
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.remove();
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Attend event
const attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already attending this event' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name email');

    try {
      const io = socketUtil.getIO();
      io.to(`event-${event._id}`).emit('attendees-updated', updatedEvent.attendees);
    } catch (socketErr) {
      console.error('Socket error:', socketErr);
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unattend event
const unattendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user.id
    );
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name email');

    try {
      const io = socketUtil.getIO();
      io.to(`event-${event._id}`).emit('attendees-updated', updatedEvent.attendees);
    } catch (socketErr) {
      console.error('Socket error:', socketErr);
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel event
const cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event.status = 'cancelled';
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name email');

    // Emit socket event for real-time update
    try {
      const io = socketUtil.getIO();
      io.to(`event-${event._id}`).emit('event-cancelled', updatedEvent);
    } catch (socketErr) {
      console.error('Socket error:', socketErr);
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Message attendees
const messageAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event.messages.push({
      sender: req.user.id,
      content: req.body.message
    });

    await event.save();

    // Emit socket event for real-time update
    try {
      const io = socketUtil.getIO();
      io.to(`event-${event._id}`).emit('new-message', {
        message: req.body.message,
        sender: req.user
      });
    } catch (socketErr) {
      console.error('Socket error:', socketErr);
    }

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove attendee
const removeAttendee = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.params.attendeeId
    );

    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('creator', 'name email');

    // Emit socket event for real-time update
    try {
      const io = socketUtil.getIO();
      io.to(`event-${event._id}`).emit('attendees-updated', updatedEvent.attendees);
    } catch (socketErr) {
      console.error('Socket error:', socketErr);
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  unattendEvent,
  cancelEvent,
  messageAttendees,
  removeAttendee
}; 