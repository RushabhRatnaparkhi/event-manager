# Event Manager

A full-stack event management application built with the MERN stack. Create, manage, and attend events with real-time updates and image hosting.

## Features

-  User Authentication
  - Register/Login
  - Guest access with limited features
  - Session management

-  Event Management
  - Create events with images
  - Edit event details
  - Cancel/Delete events
  - Real-time attendee updates

-  Attendee Features
  - Join/Leave events
  - View event details
  - See other attendees
  - Receive event updates

## Tech Stack

### Frontend
- React.js
- Material-UI
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary

## Setup

1. Clone the repo
```bash
git clone https://github.com/RushabhRatnaparkhi/event-manager.git
cd event-manager
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

3. Set up environment variables:

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=your_frontend_url
```

Create `.env` in root:
```env
REACT_APP_API_URL=your_backend_url
```

4. Run the application
```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from root directory)
npm start
```

Visit `http://localhost:3000` to use the app.

## Project Structure
```
event-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   ├── contexts/
│   ├── utils/
│   └── App.js
└── package.json
```

## Live Demo
- Frontend: [https://event-manager-gray.vercel.app](https://event-manager-gray.vercel.app)
- Backend: [https://event-manager-uzoa.onrender.com](https://event-manager-uzoa.onrender.com)

## License

This project is licensed under the MIT License.

