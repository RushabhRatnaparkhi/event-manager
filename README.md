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

- Attendee Features
  - Join/Leave events
  - View event details
  - See other attendees
  - Receive event updates

## Setup

1. Clone the repo
git clone https://github.com/RushabhRatnaparkhi/event-manager.git
cd event-manager

2. Install dependencies
-Install backend dependencies
 ```bash
 cd backend
 npm install
 ```
-Install frontend dependencies
 ```bash
 cd ..
 npm install
 ```

3. Set up environment variables in `backend/.env`:

4. Run the app
```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from root directory)
npm start
```

Visit `http://localhost:3000` to use the app.

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

