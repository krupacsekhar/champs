import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setemail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.post(
        'https://champswebapi.azurewebsites.net/api/Account/ForgotPassword',
        {
          email
        }
      );

      // Handle successful login
      setSubmitMessage('Please check your email')
    } catch (error) {
      // Handle login error
      setErrorMessage('Invalid email.');
    }
  };

  return (
    <div className='login'>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ededed', padding: '20px' }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {submitMessage && <Alert>{submitMessage}</Alert>}

        {/* Login Fields */}
        <Typography variant="h5" className='login-heading'>Forgot Password</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            fullWidth
            sx={{ marginBottom: '10px' }}
            InputLabelProps={{ sx: { color: 'grey' } }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ backgroundColor: '#335058', mb: '10px', fontSize: '14px', height: '40px' }}
          >
            Submit
          </Button>
        </form>

        <Typography variant="body1" sx={{ color: 'grey', marginTop: '10px' }}>
          <Link component={RouterLink} to="/login" sx={{ color: 'grey', '&:hover': { color: '#335058' } }}>
            Log In
          </Link>
        </Typography>
      </Container>
    </div>
  );
};

export default ForgotPassword;