import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DataCard from '../components/DataCard';
import AudioPlayer from '../components/AudioPlayer';
import sarawak_anthem from '../assets/sarawak_anthem.m4a'


const customIcon = L.icon({
  iconUrl: require('../assets/img/LocationPin.svg').default,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];

const CreateDataPoint = ({ location, onReadMoreClick }) => {
  const media = location.entryFileDetail
    .filter(file => validImageFormats.some(format => file.fileDetail.filePath.toLowerCase().endsWith(format)))
    .map(file => file.fileDetail.filePath);

  const address = `${location.address.addressLineOne}, ${location.address.addressLineTwo}, ${location.address.city}, ${location.address.country}`;



  return (
    <Box className="popup-content">
      <Typography variant="h6" component="h3" gutterBottom>
        {location.title}
      </Typography>
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
        {media.map((imageUrl, index) => (
          <div key={index}>
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </Carousel>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Address
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {address}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '8px', fontSize: '18px', marginBottom: '0px' }}>
        Description
      </Typography>
      <Typography variant="body2" sx={{ margin: '0px !important', padding: '0px !important' }} gutterBottom>
        {location.description}
      </Typography>
      <Typography variant="body2" gutterBottom align="right" color="#335058" fontWeight="600" onClick={() => onReadMoreClick(location)}>
        Read more
      </Typography>
    </Box>
  );
};

const isValidLatLng = (lat, lng) => {
  return typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng);
};

const MapPage = () => {
  const [pinLocations, setPinLocations] = useState([]);
  const [isDataCardOpen, setIsDataCardOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch('https://champswebapi.azurewebsites.net/api/Entry')
      .then(response => response.json())
      .then(data => {
        // Filter the data to include only approved entries
        const approvedEntries = data.filter(entry => {
          const lastEntryStatus = entry.entryTimeline.slice(-1)[0]?.entryStatus;
          return lastEntryStatus?.name === 'Approved';
        });
        setPinLocations(approvedEntries);
      });
  }, []);

  const handleReadMoreClick = (location) => {
    setSelectedLocation(location);
    setIsDataCardOpen(true);
    mapInstance?.dragging.disable();
  };

  const handleDataCardClose = () => {
    setIsDataCardOpen(false);
    setSelectedLocation(null);
    mapInstance?.dragging.enable();
  };

  const handleMapCreated = (map) => {
    setMapInstance(map);
  };

  const handleMoveEnd = () => {
    if (!isDataCardOpen && mapInstance) {
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      const { lat, lng } = center;
      const zoomLevel = zoom;

      const stateObj = {
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        zoom: zoomLevel,
      };

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('lat', lat.toFixed(6));
      urlParams.set('lng', lng.toFixed(6));
      urlParams.set('zoom', zoomLevel.toString());
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

      window.history.replaceState(stateObj, '', newUrl);
    }
  };


  const initialMapCenter = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat'));
    const lng = parseFloat(urlParams.get('lng'));
    const zoom = parseInt(urlParams.get('zoom'));

    if (lat && lng && zoom) {
      return [lat, lng];
    } else {
      return [1.5574, 110.3591]; // Default initial center
    }
  };

  const initialMapZoom = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const zoom = parseInt(urlParams.get('zoom'));

    if (zoom) {
      return zoom;
    } else {
      return 9; // Default initial zoom level
    }
  };



  return (
    <div style={{ position: 'relative', marginTop: '30px' }}>
      <MapContainer
        center={initialMapCenter()}
        zoom={initialMapZoom()}
        style={{ height: '100vh', display: isDataCardOpen ? 'none' : 'block' }}
        whenCreated={handleMapCreated}
        ref={mapRef}
        onMoveEnd={handleMoveEnd}

      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pinLocations.map((location) => {
          // Check if the location has valid latitude and longitude values
          if (!isValidLatLng(location.latitude, location.longitude)) {
            return null; // Skip rendering invalid markers
          }

          return (
            <div className='marker-popup-container' key={location.id}>
              <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
                <Popup className="marker-popup">
                  <CreateDataPoint location={location} onReadMoreClick={handleReadMoreClick} />
                </Popup>
              </Marker>
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'grey',
            borderRadius: '50px',
            padding: '10px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
            zIndex: 2, // Ensure the audio player appears above the map
          }}
        >
          <AudioPlayer audioUrl={sarawak_anthem} />
        </div>
      </MapContainer>

      {isDataCardOpen && selectedLocation && (
        <div
          className="popup-overlay"
          style={{ backgroundColor: '#ededed', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <div className="popup-card">
            <button className="data-close-button" onClick={handleDataCardClose}>
              X
            </button>
            <DataCard location={selectedLocation} />
          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;
