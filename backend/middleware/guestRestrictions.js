const restrictGuest = (req, res, next) => {
  if (req.user.isGuest) {
    return res.status(403).json({ 
      message: 'This action is not available for guest users. Please register for full access.',
      restrictions: [
        'Cannot create events',
        'Cannot edit events',
        'Cannot delete events',
        'Cannot attend events',
        'Cannot interact with other users',
        'Limited to viewing events only'
      ]
    });
  }
  next();
};

module.exports = restrictGuest; 