import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import axios from 'axios';
import BookmarkIcon from './BookmarkIcon';


const DataCard = ({ location }) => {
  const media = location.entryFileDetail.map((file) => file.fileDetail.filePath);
  const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
  const token = localStorage.getItem('token');


  const validMedia = media.filter((imageUrl) => {
    const fileExtension = imageUrl.substring(imageUrl.lastIndexOf('.')).toLowerCase();
    return validImageFormats.includes(fileExtension);
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    try {
      const response = await axios.get(
        'https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const isEntryBookmarked = response.data.some(
        (favoriteEntry) => favoriteEntry.id === location.id
      );

      setIsFavorite(isEntryBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const entryID = location.id;

      if (isFavorite) {
        await axios.delete(
          `https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite/${entryID}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
      } else {
        await axios.post(
          `https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite/${entryID}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }
        );
      }

      setIsFavorite((prevState) => !prevState);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

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

  const fetchUserName = async (id) => {
    try {
      // Check if the bearer token is present in local storage
      const token = localStorage.getItem('token');

      const response = await axios.get(`https://champswebapi.azurewebsites.net/api/UserDetail/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { fullName } = response.data;
      return fullName;
    } catch (error) {
      setUserRole('err');
      console.error('Error:', error);
      return '';
    }
  };

  const bookOrNo = userRole === "" ? (<div></div>) : (<BookmarkIcon
    isBookmarked={isFavorite}
    onClick={toggleBookmark}
  />)

  const [fullName, setFullName] = useState('');

  // Use useEffect to fetch the fullName once the component mounts
  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const name = await fetchUserName(location.createdByUserDetailId);
        setFullName(name);
      } catch (error) {
        setFullName('err');
      }
    };

    fetchFullName();
  }, [location.createdByUserDetailId]);

  return (
    <Box className="data-popup-content">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <Typography variant="h6" component="h3" gutterBottom>
          {location.title}
        </Typography>
        {/* We wrap the BookmarkIcon with a div to apply custom styling */}
        <div style={{ marginLeft: '10px', fontSize: '28px', cursor: 'pointer' }}>
          {bookOrNo}
        </div>
      </div>
      <Carousel
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="control-arrow prev"
            >
              &lt;
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="control-arrow next"
            >
              &gt;
            </button>
          )
        }
      >
        {validMedia.map((imageUrl, index) => (
          <div key={index}>
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="data-carousel-image"
            />
          </div>
        ))}
      </Carousel>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Date Created
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.dateCreated.split('T')[0]}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Creator:
      </Typography>
      {/* Conditionally render the Typography component based on fullName */}
      {fullName ? (
        <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
          {fullName}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
          Loading...
        </Typography>
      )}
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Address
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.address.addressLineOne}, {location.address.addressLineTwo}, {location.address.city}, {location.address.country}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Description
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.content}
      </Typography>
      {/*
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        About
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.about}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Others
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.others}
      </Typography>*/}
    </Box>
  );
};

export default DataCard;
