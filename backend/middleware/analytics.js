const Event = require('../models/Event');

const trackEventAnalytics = async (req, res, next) => {
  const eventId = req.params.id;
  
  if (eventId) {
    try {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { viewCount: 1 },
        $push: {
          pageViews: {
            timestamp: new Date(),
            userId: req.user?.id || 'anonymous',
            userAgent: req.headers['user-agent']
          }
        }
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  next();
};

module.exports = trackEventAnalytics; 