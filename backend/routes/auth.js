const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, guestLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegister } = require('../middleware/validate');

console.log('Setting up auth routes...');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getCurrentUser);

// @route   POST api/auth/guest-login
// @desc    Guest login
// @access  Public
router.post('/guest-login', guestLogin);

module.exports = router; 