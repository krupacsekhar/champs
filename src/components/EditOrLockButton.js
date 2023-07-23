import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const EditOrLockButton = ({ datapoint, onEditIconClick }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New state to handle loading

  const handleEditIconClick = () => {
    // Call the onEditIconClick callback with the datapoint
    if (onEditIconClick) {
      onEditIconClick(datapoint);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the bearer token is present in local storage
        const token = localStorage.getItem('token');

        if (!token) {
          setUserRole(''); // No token, set userRole to an empty string
          setIsLoading(false); // Update loading state to false
          return;
        }

        const response = await axios.get('https://champswebapi.azurewebsites.net/api/UserDetail/0', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { userRole } = response.data;
        setUserRole(userRole);
        setIsLoading(false); // Update loading state to false once data is fetched
      } catch (error) {
        setUserRole('err');
        setIsLoading(false); // Update loading state to false in case of an error
        console.error('Error:', error);
      }
    };

    fetchData().catch(error => {
      setIsLoading(false); // Update loading state to false in case of an error
      console.error('Error:', error);
    });
  }, []);

  useEffect(() => {
    setIsLocked(datapoint.entryTimeline[datapoint.entryTimeline.length - 1].entryStatus.name === "Reviewing");
  }, [datapoint]);

  const handleLock = async () => {
    // Call the API to change the entry status to "Reviewing"
    try {
      const entryID = datapoint.id;
      const token = 'YOUR_ACCESS_TOKEN'; // Replace with your actual token
      await axios.get(`https://champswebapi.azurewebsites.net/api/Entry/${entryID}/2`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update the state to show the "Unlock" icon
      setIsLocked(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlock = async () => {
    // Call the API to change the entry status to "Pending"
    try {
      const entryID = datapoint.id;
      const token = 'YOUR_ACCESS_TOKEN'; // Replace with your actual token
      await axios.get(`https://champswebapi.azurewebsites.net/api/Entry/${entryID}/1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update the state to show the "Lock" icon
      setIsLocked(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while fetching userRole
  }

  return (
    <div>
      {userRole === 'User' && isLocked ? (
        <IconButton style={{ color: 'grey' }} aria-label="Locked">
          <LockIcon />
        </IconButton>
      ) : userRole === 'User' ? (
        <IconButton style={{ color: '#FCD116' }} aria-label="Edit" onClick={() => handleEditIconClick(datapoint)}>
          <EditIcon />
        </IconButton>
      ) : (
        <div>
          <IconButton style={{ color: '#FCD116' }} aria-label="Edit" onClick={() => handleEditIconClick(datapoint)}>
            <EditIcon />
          </IconButton>
          {isLocked ? (
            <IconButton style={{ color: 'black' }} aria-label="Unlock" onClick={handleUnlock}>
              <LockIcon />
            </IconButton>
          ) : (
            <IconButton style={{ color: 'grey' }} aria-label="Lock" onClick={handleLock}>
              <LockOpenIcon />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

export default EditOrLockButton;
