const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user'
  },
  interests: [{
    type: String
  }],
  organization: {
    name: String,
    position: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  profileImage: {
    type: String
  },
  eventsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  eventsOrganized: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 