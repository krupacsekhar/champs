import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const SignupUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        'https://champswebapi.azurewebsites.net/api/Authentication/Register',
        {
          fullName,
          email,
          phoneNumber,
          password,
          confirmPassword
        }
      );

      // Handle successful sign up
      console.log(response.data);
      window.location.href = '/login';
    } catch (error) {
      // Handle sign up error
      console.log("this is the error");
      console.log(error);
      setErrorMessage('Error signing up.');
    }
  };

  return (
    <div className='signup'>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ededed', padding: '20px' }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Typography variant="h5" className='login-heading'>Sign Up</Typography>
        <TextField
          label="Full Name"
          variant="outlined"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
          InputLabelProps={{ sx: { color: 'grey' } }}
        />
        <TextField
          label="Email (eg. user@example.com)"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
          InputLabelProps={{ sx: { color: 'grey' } }}
        />
        <TextField
          label="Phone Number (eg. 0141234567)"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
          InputLabelProps={{ sx: { color: 'grey' } }}
        />
        <TextField
          label="Password (at least 6 characters long)"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: '10px' }}
          InputLabelProps={{ sx: { color: 'grey' } }}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: '20px' }}
          InputLabelProps={{ sx: { color: 'grey' } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ backgroundColor: '#335058', mb: '20px', fontSize: '14px', height: '40px' }}
        >
          Sign Up
        </Button>
        <Typography variant="body1" sx={{ color: 'grey', marginTop: '10px' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" sx={{ color: 'grey', '&:hover': { color: '#335058' } }}>
            Log In
          </Link>
        </Typography>
      </Container>
    </div >);
};

export default SignupUser;

