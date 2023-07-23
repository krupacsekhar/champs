import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';


const SignupExpert = () => {
  const [ethnicGroup, setEthnicGroup] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token');


  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        'https://champswebapi.azurewebsites.net/api/Authentication/HeritageExpert',
        {
          fullName,
          email,
          phoneNumber,
          password,
          confirmPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
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

  const ethnicGroupOptions = ['Bidayuh', 'Chinese', 'Iban', 'Indian', 'Malay'];


  return (
    <div className='signup'>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ededed', padding: '20px' }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Typography variant="h5" className='login-heading'>Register a Heritage Expert</Typography>
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
          name="ethnicGroup"
          label="Ethnic Group"
          variant="outlined"
          value={ethnicGroup}
          onChange={(e) => setEthnicGroup(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: '10px' }}
          select
          InputLabelProps={{ sx: { color: 'grey' } }}
        >
          {ethnicGroupOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
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

      </Container>
    </div >);
};

export default SignupExpert;

