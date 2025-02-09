const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Guest login
const guestLogin = async (req, res) => {
  try {
    console.log('Starting guest login process');
    // Try to find an existing guest user
    let guestUser = await User.findOne({ email: 'guest@example.com' });
    console.log('Existing guest user:', guestUser);

    // If guest user doesn't exist, create one
    if (!guestUser) {
      console.log('Creating new guest user');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('guest123', salt);

      guestUser = new User({
        name: 'Guest User',
        email: 'guest@example.com',
        password: hashedPassword,
        isGuest: true
      });

      await guestUser.save();
      console.log('New guest user created:', guestUser);
    }

    // Create JWT token
    const payload = {
      user: {
        id: guestUser.id,
        isGuest: true
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign error:', err);
          throw err;
        }
        console.log('Token generated successfully');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Guest login error:', err);
    res.status(500).json({ 
      message: 'Server error during guest login',
      error: err.message 
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  guestLogin
}; 