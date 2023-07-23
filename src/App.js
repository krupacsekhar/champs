import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages';
import MapPage from './pages/MapPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar.js';
import Upload1 from './pages/Upload1';
import ManageTask from './pages/ManageTask';
import Favorites from './pages/Favorites';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import DataPointDetailsPage from './pages/DataPointDetailsPage';
import SignupUser from './pages/SignupUser';
import SignupAdmin from './pages/SignupAdmin';
import SignupExpert from './pages/SignupExpert';
import ForgotPassword from './pages/ForgotPassword';
import ManageProfile from './pages/ManageProfile';

function App() {

  const [userRole, setUserRole] = useState('');


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

  // Rest of your component



  useEffect(() => {
    const updateUserRole = async () => {
      try {
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

    // Call the updateUserRole function periodically to check for updates
    const interval = setInterval(updateUserRole, 1000); // Adjust the interval as needed

    return () => {
      // Clean up the interval when the component unmounts
      clearInterval(interval);
    };
  }, []); // Empty dependency array ensures the effect runs only once



  return (
    <Router>
      <div>
        {/* Rest of your component */}
      </div>
      <NavBar user={userRole} />
      <div style={{ height: '100vh' }}>
        <Routes>
          <Route exact path="/" element={<MapPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/upload" element={<Upload1 />} />
          <Route path="/manage-task" element={<ManageTask />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/datapointdetails/:category" element={<DataPointDetailsPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup-user" element={<SignupUser />} />
          <Route path="/signup-admin" element={<SignupAdmin />} />
          <Route path="/signup-expert" element={<SignupExpert />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/manage-profile" element={<ManageProfile />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;


