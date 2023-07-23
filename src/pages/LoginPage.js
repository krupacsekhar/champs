import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import champs_home from "../assets/img/home-bg.svg"

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post(
        'https://champswebapi.azurewebsites.net/api/Authentication/Login',
        {
          username,
          password
        }
      );

      // Handle successful login
      const { token } = response.data;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Navigate to /map
      window.location.href = '/map';
    } catch (error) {
      // Handle login error
      setErrorMessage('Invalid username or password.');
    }
  };


  return (
    <div className='login'>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ededed', padding: '20px' }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {/* Login Fields */}
        <Typography variant="h5" className='login-heading'>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px' }}
            InputLabelProps={{ sx: { color: 'grey' } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
            InputLabelProps={{ sx: { color: 'grey' } }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ backgroundColor: '#335058', mb: '10px', fontSize: '14px', height: '40px' }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body1" sx={{ color: 'grey', marginTop: '10px' }}>
          New User?{' '}
          <Link component={RouterLink} to="/signup" sx={{ color: 'grey', '&:hover': { color: '#335058' } }}>
            Sign up
          </Link>
        </Typography>

        <Typography variant="body1" sx={{ color: 'grey', marginTop: '10px' }}>
          Forgot Password?{' '}
          <Link component={RouterLink} to="/forgot-password" sx={{ color: 'grey', '&:hover': { color: '#335058' } }}>
            Click here
          </Link>
        </Typography>
      </Container>
      <Container className="align-items-center" style={{ textAlign: 'center' }}>
        <img src={champs_home} style={{ width: '100%', maxWidth: '500px' }} alt="Champs Home" />
      </Container>
    </div>
  );
};

export default LoginPage;