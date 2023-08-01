import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DataCard from '../components/DataCard';
import { Place } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server';
import { FormControlLabel, Checkbox } from '@mui/material';



const culturalHeritageCategoryIdMapping = {
  'Heritage Sites': 1,
  Monuments: 2,
  Buildings: 3,
  'Street Art': 6,
  'Fine Art/Crafts': 7,
  'Food/Gastronomy': 8,
  Music: 9,
  Dance: 10,
  Rituals: 11,
  'Oral Traditions/Stories': 13,
  'Cultural Festivals/Events': 14,
  'Traditional Knowledge': 15,
};

const idToCulturalHeritageCategoryMapping = {
  // Mapping of culturalHeritageCategoryId to category names
  1: 'Heritage Sites',
  2: 'Monuments',
  3: 'Buildings',
  6: 'Street Art',
  7: 'Fine Art/Crafts',
  8: 'Food/Gastronomy',
  9: 'Music',
  10: 'Dance',
  11: 'Rituals',
  13: 'Oral Traditions/Stories',
  14: 'Cultural Festivals/Events',
  15: 'Traditional Knowledge',
};

const customIcon = {
  // Define different colors for each category name
  'Heritage Sites': 'red',
  Monuments: '#E9AB17',
  Buildings: 'green',
  'Street Art': 'orange',
  'Fine Art/Crafts': 'blue',
  'Food/Gastronomy': 'purple',
  Music: '#D891EF',
  Dance: '#6960EC',
  Rituals: 'indigo',
  'Oral Traditions/Stories': 'magenta',
  'Cultural Festivals/Events': 'olive',
  'Traditional Knowledge': 'DarkBlue',
};

const getCustomIcon = (categoryName) => {
  // Define the icon styles
  const iconStyles = {
    fontSize: 32,
    color: customIcon[categoryName] || '#000000', // Default color if the category is not in customIcon
  };

  // Render the Place icon as an SVG and convert it to a string
  const iconSvgString = ReactDOMServer.renderToString(
    <Place style={iconStyles} />
  );

  // Return the Leaflet divIcon with the SVG string
  return L.divIcon({
    className: 'custom-icon',
    html: iconSvgString,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};



const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];

const CreateDataPoint = ({ location, onReadMoreClick }) => {
  const media = location.entryFileDetail
    .filter(file => validImageFormats.some(format => file.fileDetail.filePath.toLowerCase().endsWith(format)))
    .map(file => file.fileDetail.filePath);

  const address = `${location.address.addressLineOne}, ${location.address.addressLineTwo}, ${location.address.city}, ${location.address.country}`;



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
        {media.map((imageUrl, index) => (
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
      <Typography variant="body2" cursor="pointer" gutterBottom align="right" color="#335058" fontWeight="600" onClick={() => onReadMoreClick(location)}>
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
  const [selectedCategories, setSelectedCategories] = useState(Object.keys(culturalHeritageCategoryIdMapping));
  const [isDataCardOpen, setIsDataCardOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Filter');
  const [selectedMarkerLocation, setSelectedMarkerLocation] = useState(null);


  const handleMarkerClick = (location) => {
    setSelectedTab('Data Point');
    setSelectedMarkerLocation(location);
  };
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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // You can handle the error here, e.g., show a message to the user
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
      return [1.5574, 110.3]; // Default initial center
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


  const circumference = 15000; // Adjust this value as needed

  // Calculate the bounding box
  const centerCoords = L.latLng(1.5574, 110.3);
  const bounds = centerCoords.toBounds(circumference);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedCategories((prevCategories) => [...prevCategories, name]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((category) => category !== name)
      );
    }
  };

  const minZoomLevel = 9.3; // Adjust this value as needed
  const maxZoomLevel = 15; // Adjust this value as needed


  return (
    <div style={{ position: 'relative', marginTop: '30px', height: '100vh' }}>
      <MapContainer
        center={initialMapCenter()}
        zoom={initialMapZoom()}
        style={{ height: '100vh', display: isDataCardOpen ? 'none' : 'block' }}
        whenCreated={handleMapCreated}
        ref={mapRef}
        onMoveEnd={handleMoveEnd}
        maxBounds={bounds}
        maxBoundsViscosity={0.5} // Adjust this value to control the stickiness to the bounds
        minZoom={minZoomLevel}

      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pinLocations.map((location) => {
          // Check if the location's category is included in selectedCategories
          if (!selectedCategories.includes(idToCulturalHeritageCategoryMapping[location.culturalHeritageCategoryId])) {
            return null; // Skip rendering markers for unselected categories
          }

          if (location.latitude === null || location.longitude === null) {
            return null;
          }

          return (
            <div className='marker-popup-container' key={location.id}>
              <Marker
                position={[location.latitude, location.longitude]}
                icon={getCustomIcon(idToCulturalHeritageCategoryMapping[location.culturalHeritageCategoryId])}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              />
            </div>
          );
        })}
      </MapContainer>

      <div
        className="filter-panel"
        style={{
          position: 'absolute',
          bottom: 20,
          margin: '10px !important',
          marginBottom: '10px !important',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          width: '100%',
          maxHeight: '33%',
          // Add the following styles to make the content scrollable within the div
          overflow: 'auto',
        }}
      >
        {/* Typography Headings (Filter and Data Point) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 0.01 }}>
            <Typography variant="h6" style={{ cursor: 'pointer', color: selectedTab === 'Filter' ? 'black' : 'gray' }} onClick={() => setSelectedTab('Filter')}>Filter</Typography>
          </div>
          <div style={{ flexGrow: 0.01 }}>
            <Typography variant="h6" style={{ cursor: 'pointer', color: selectedTab === 'Data Point' ? 'black' : 'gray' }} onClick={() => setSelectedTab('Data Point')}>Data Point</Typography>
          </div>
        </div>


        {selectedTab === 'Filter' && (
          <div>
            {Object.keys(culturalHeritageCategoryIdMapping).map((categoryName) => (
              <FormControlLabel
                key={categoryName}
                control={<Checkbox checked={selectedCategories.includes(categoryName)} onChange={handleFilterChange} name={categoryName} />}
                label={categoryName}
                style={{ color: customIcon[categoryName] }}
              />
            ))}
          </div>
        )}

        {selectedTab === 'Data Point' && (
          <div>
            {selectedMarkerLocation ? (
              <CreateDataPoint location={selectedMarkerLocation} onReadMoreClick={handleReadMoreClick} />
            ) : (<div style={{ color: 'black' }}>Please select a datapoint from the map!</div>)}
          </div>
        )}
      </div>

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
