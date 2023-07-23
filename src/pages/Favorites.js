import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import axios from 'axios';
import DataCard from '../components/DataCard';
import BookmarkIcon from '../components/BookmarkIcon';

const Favorites = () => {
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const token = localStorage.getItem('token');


  useEffect(() => {
    fetchFavoriteEntries();
  }, []);

  const fetchFavoriteEntries = async () => {
    try {
      const response = await axios.get(
        'https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setFavoriteEntries(response.data);
    } catch (error) {
      console.error('Error fetching favorite entries:', error);
    }
  };

  const handleViewMore = (entry) => {
    setSelectedEntry(entry);
  };

  const isEntryBookmarked = (entryId) => {
    return favoriteEntries.some((entry) => entry.id === entryId);
  };

  const toggleBookmark = async (entryId) => {
    try {
      if (isEntryBookmarked(entryId)) {
        // Remove entry from bookmarks
        await axios.delete(
          `https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite/${entryId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setFavoriteEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== entryId)
        );
      } else {
        // Add entry to bookmarks
        await axios.post(
          `https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite/${entryId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const response = await axios.get(
          'https://champswebapi.azurewebsites.net/api/Entry/EntryFavorite',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setFavoriteEntries(response.data);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const getFirstValidImage = (entry) => {
    const validImageFormats = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.svg',
    ];

    const validFile = entry.entryFileDetail.find((file) => {
      const fileExtension = file.fileDetail.filePath
        .substring(file.fileDetail.filePath.lastIndexOf('.'))
        .toLowerCase();
      return validImageFormats.includes(fileExtension);
    });

    return validFile ? validFile.fileDetail.filePath : null;
  };

  return (
    <div className="manage">
      <Container maxWidth="sm">
        <Typography variant="h4" className="heading">
          Favorites
        </Typography>
        {favoriteEntries.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            style={{
              color: '#335058',
              marginTop: '16px',
              fontWeight: 'normal',
            }}
          >
            You have no favorites yet. Explore the map to start favoriting!
          </Typography>
        ) : (
          <div>
            {favoriteEntries.map((entry) => (
              <Card key={entry.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" style={{ color: '#335058' }}>
                    {entry.title}
                  </Typography>
                  <BookmarkIcon
                    isBookmarked={isEntryBookmarked(entry.id)}
                    onClick={() => toggleBookmark(entry.id)}
                  />
                </div>
                {getFirstValidImage(entry) && (
                  <img
                    src={getFirstValidImage(entry)}
                    alt="Entry Image"
                  />
                )}
                <Typography>{entry.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: '#FCD116',
                    alignSelf: 'flex-end',
                  }}
                  onClick={() => handleViewMore(entry)}
                >
                  View More
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Container>
      {selectedEntry && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button
              className="data-close-button"
              onClick={() => setSelectedEntry(null)}
            >
              X
            </button>
            <DataCard location={selectedEntry} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
