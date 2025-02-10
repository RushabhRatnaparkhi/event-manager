let io;

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: function(origin, callback) {
          // Use the same origins as your main app
          const allowedOrigins = [
            'https://event-manager-gray.vercel.app',
            'https://event-manager-git-master-rushabhs-projects-f521edbc.vercel.app',
            'http://localhost:3000'
          ];
          
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-event', (eventId) => {
        socket.join(`event-${eventId}`);
        console.log(`Socket ${socket.id} joined event-${eventId}`);
      });

      socket.on('leave-event', (eventId) => {
        socket.leave(`event-${eventId}`);
        console.log(`Socket ${socket.id} left event-${eventId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
}; 