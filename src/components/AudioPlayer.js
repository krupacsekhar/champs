import React, { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Box, IconButton, Slider, Tooltip } from '@mui/material';


const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 'auto',
          width: '300px', // Increased the width for better spacing
        }}
      >
        <IconButton
          onClick={handlePlayPause}
          sx={{ color: '#335058', padding: '10px' }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              color: '#335058',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'center',
              width: '100%', // Make the box full width
            }}
          >
            Sarawak Anthem {/* This is the label for the Slider */}
          </Box>
          <Slider
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleProgressChange}
            sx={{ color: '#335058', width: '80%', marginLeft: '10px' }}
            components={{
              ValueLabel: () => null, // Hide the default time label
            }}
          />

        </div>




      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

export default AudioPlayer;
