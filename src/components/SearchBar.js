import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import DataCard from './DataCard';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedDatapoint, setSelectedDatapoint] = useState(null);

  const handleViewMore = (datapoint) => {
    setSelectedDatapoint(datapoint);
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('https://champswebapi.azurewebsites.net/api/Entry');
        const entries = response.data;
        const filteredEntries = entries.filter((entry) => {
          const { entryTimeline } = entry;
          return entryTimeline.length > 0 && entryTimeline[entryTimeline.length - 1].entryStatus.name === 'Approved';
        });
        const entryTitles = filteredEntries.map((entry) => entry.title);
        setOptions(entryTitles);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://champswebapi.azurewebsites.net/api/Entry');
      const entries = response.data;
      const filteredEntries = entries.filter((entry) => {
        const { entryTimeline } = entry;
        return entryTimeline.length > 0 && entryTimeline[entryTimeline.length - 1].entryStatus.name === 'Approved';
      });
      const filteredResults = filteredEntries.filter((entry) => {
        const { title, description, content, about } = entry;
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        return (
          title.toLowerCase().includes(lowercaseSearchTerm) ||
          description.toLowerCase().includes(lowercaseSearchTerm) ||
          content.toLowerCase().includes(lowercaseSearchTerm) ||
          about.toLowerCase().includes(lowercaseSearchTerm)
        );
      });
      setSearchResults(filteredResults);
      setShowPanel(true);
    } catch (error) {
      console.error('Error searching entries:', error);
    }
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  return (
    <Box display="flex" alignItems="center">
      <Autocomplete
        freeSolo
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ ...params.InputProps, style: { height: '45px', width: '150px' }, hideLabel: true }}
            sx={{ marginRight: '8px' }}
            size="small"
          />
        )}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          bgcolor: '#FCD116',
          color: '#ffffff',
          '&:hover': {
            bgcolor: '#DEB504', // Specify the hover background color
          },
        }}
      >
        Search
      </Button>


      {showPanel && (
        <Box
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          width="300px"
          bgcolor="#ffffff"
          boxShadow={1}
          overflow="auto"
          p={2}
          marginTop="55px"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h6"
              style={{ color: '#335058', wordWrap: 'break-word' }}
            >
              Search results
            </Typography>
            <IconButton onClick={handleClosePanel}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box mt={2}>
            {searchResults.map((datapoint) => (
              <Card key={datapoint.id} sx={{ mb: 2 }} onClick={() => handleViewMore(datapoint)}>
                <CardContent>
                  <Typography variant="h6" style={{ color: '#335058' }}>
                    {datapoint.title}
                  </Typography>
                  <Typography>{datapoint.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {selectedDatapoint && (
        <div className="popup-overlay">
          <div className="popup-card">
            <button className="data-close-button" onClick={() => setSelectedDatapoint(null)}>
              X
            </button>
            {/* Render additional details for the selected datapoint */}
            <DataCard location={selectedDatapoint} />
          </div>
        </div>
      )}
    </Box>


  );
};

export default SearchBar;
