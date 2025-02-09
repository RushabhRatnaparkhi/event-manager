import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventDashboard from './components/Events/EventDashboard';
import EventCreate from './components/Events/EventCreate';
import EventDetails from './components/Events/EventDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#D14848',
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <EventDashboard />
              </ProtectedRoute>
            } />
            <Route path="/events/create" element={
              <ProtectedRoute>
                <EventCreate />
              </ProtectedRoute>
            } />
            <Route path="/events/:id" element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } />

            {/* Redirect all other routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 