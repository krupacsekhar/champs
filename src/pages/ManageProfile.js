import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import orangutan from "../assets/img/orangutan.png";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';





const ManageProfile = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the bearer token is present in local storage
        const token = localStorage.getItem('token');

        if (!token) {
          setUserRole(''); // No token, set userRole to an empty string
          return;
        }

        const response = await axios.get('https://champswebapi.azurewebsites.net/api/UserDetail/0', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { userRole } = response.data;
        setUserRole(userRole);
      } catch (error) {
        setUserRole('err');
        console.error('Error:', error);
      }
    };

    fetchData().catch(error => {
      console.error('Error:', error);
    });
  }, []);

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        'https://champswebapi.azurewebsites.net/api/Account/ChangePassword',
        {
          oldPassword,
          newPassword
        },
        {
          headers
        }
      );

      console.log(response.data); // Handle the response data accordingly
    } catch (error) {
      console.error(error); // Handle error if the request fails
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the bearer token is present in local storage
        const token = localStorage.getItem('token');

        const response = await axios.get('https://champswebapi.azurewebsites.net/api/UserDetail/0', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { fullName } = response.data;
        setFullName(fullName);

        const { email } = response.data;
        setEmail(email);

        const { phone } = response.data;
        setPhone(phone);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData().catch(error => {
      console.error('Error:', error);
    });
  }, []);

  const navigate = useNavigate();

  const handleRegHeritage = () => {
    navigate("/signup-expert")
  };

  const handleRegAdmin = () => {
    navigate("/signup-admin")
  }

  const adminProfiles = (userRole === ('SystemAdmin') || userRole === ('Admin')) ? (<div style={{ color: '#335058', marginTop: '10px', marginBottom: '10px' }}>
    <Typography variant="p" gutterBottom onClick={handleRegHeritage}>
      <u>Register a new Heritage Expert</u>
    </Typography>
    <br></br>
    <Typography variant="p" gutterBottom onClick={handleRegAdmin}>
      <u>Register a new Admin</u>
    </Typography>
  </div>) : (<div></div>)

  return (
    <Row>
      <Col md={7} style={{ color: '#335058', marginTop: '50px', padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Manage Profile
        </Typography>
        <Typography variant="h6" gutterBottom>
          Hello, {fullName}! Here is your current information:
        </Typography>
        {/* Existing profile information */}
        <div>
          <Typography variant="p" gutterBottom>
            <b>Email:</b> {email}
          </Typography>
        </div>
        <div>
          <Typography variant="p" gutterBottom>
            <b>Phone number:</b> {phone}
          </Typography>
        </div>
        {adminProfiles}
        <div>
          <Typography variant="p" gutterBottom>
            <b>If you would like to change your password, you can do so below:</b>
          </Typography>
        </div>
        <TextField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" sx={{ backgroundColor: "#335058" }} onClick={handleChangePassword}>
          Change Password
        </Button>
      </Col>

      <Col md={5} style={{ textAlign: 'center' }}>
        {/* Display your orangutan image here */}
        <img src={orangutan} alt="Orangutan" style={{ width: '100%' }} />
      </Col>
    </Row>
  );
};

export default ManageProfile;
