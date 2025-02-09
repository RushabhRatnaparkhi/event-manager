import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Event Manager
        </Typography>
        <Box>
          {user ? (
            <>
              {user.isGuest ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Guest User
                  </Typography>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    size="small"
                  >
                    Register for Full Access
                  </Button>
                  <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
                    Logout
                  </Button>
                </Box>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/events/create"
                  >
                    Create Event
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
              )}
              {isLoginPage && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 