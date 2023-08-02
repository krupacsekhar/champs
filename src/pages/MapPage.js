import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography, Box, FormControl, Select, MenuItem } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DataCard from '../components/DataCard';
import { Place, CloseFullscreen, OpenInFull, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server';
import { FormControlLabel, Checkbox } from '@mui/material';
import Divider from '@mui/material/Divider';




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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(true);
  const [isFilterPanelMinimized, setIsFilterPanelMinimized] = useState(false);
  const [culturalHeritageType, setCulturalHeritageType] = useState('');
  const [culturalHeritageCategory, setCulturalHeritageCategory] = useState('');


  const handleFilterPanelToggle = () => {
    if (isFilterPanelMinimized) {
      // If the panel is minimized, toggle to expand
      setIsFilterPanelMinimized(false);
    } else {
      // Otherwise, toggle between expanded and closed
      setIsFilterPanelExpanded((prevState) => !prevState);
      if (!isFilterPanelExpanded) {
        // If the panel is being expanded, set isFilterPanelMinimized to false
        setIsFilterPanelMinimized(false);
      }
    }
  };

  const handleFilterPanelMinimize = () => {
    setIsFilterPanelMinimized((prevState) => !prevState); // Toggle the isFilterPanelMinimized state
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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


  const [tangibleDropdownOpen, setTangibleDropdownOpen] = useState(false);
  const [intangibleDropdownOpen, setIntangibleDropdownOpen] = useState(false);

  // Step 2: Add event handlers to toggle checkbox visibility
  const handleTangibleDropdownToggle = () => {
    setTangibleDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleIntangibleDropdownToggle = () => {
    setIntangibleDropdownOpen((prevOpen) => !prevOpen);
  };

  // Step 3: Create a function to render the checkboxes for Tangible category
  const renderTangibleCheckboxes = () => {
    return tangibleDropdownOpen ? (
      <div>
        {['Fine Art/Crafts', 'Street Art', 'Buildings', 'Monuments', 'Heritage Sites'].map((categoryName) => (
          <FormControlLabel
            key={categoryName}
            control={<Checkbox checked={selectedCategories.includes(categoryName)} onChange={handleFilterChange} name={categoryName} />}
            label={categoryName}
            style={{ color: customIcon[categoryName] }}
          />
        ))}
      </div>
    ) : (<div></div>);
  };

  // Step 4: Create a function to render the checkboxes for Intangible category
  const renderIntangibleCheckboxes = () => {
    return intangibleDropdownOpen ? (
      <div>
        {['Traditional Knowledge', 'Cultural Festivals/Events', 'Oral Traditions/Stories', 'Rituals', 'Dance', 'Music', 'Food/Gastronomy'].map((categoryName) => (
          <FormControlLabel
            key={categoryName}
            control={<Checkbox checked={selectedCategories.includes(categoryName)} onChange={handleFilterChange} name={categoryName} />}
            label={categoryName}
            style={{ color: customIcon[categoryName] }}
          />
        ))}
      </div>
    ) : (<div></div>)
  };

  const renderCheckboxesBasedOnDropdown = () => {
    if (culturalHeritageType === 'tangible') {
      return renderTangibleCheckboxes();
    } else if (culturalHeritageType === 'intangible') {
      return renderIntangibleCheckboxes();
    }
    return null;
  };



  const minZoomLevel = 9.3; // Adjust this value as needed
  const maxZoomLevel = 15; // Adjust this value as needed


  return (
    <div style={{ position: 'relative', marginTop: '70px', height: '100vh' }}>
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

      <div className={`filter-panel ${isMobile ? 'filter-panel-bottom' : 'filter-panel-left'} ${isFilterPanelMinimized ? 'minimized' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ cursor: 'pointer' }} onClick={handleFilterPanelToggle}>
            {isFilterPanelExpanded ? (!isMobile && isMobile ? (
              <CloseFullscreen style={{ color: 'black' }} />
            ) : (<div></div>)) : (
              <OpenInFull style={{ color: 'black' }} />
            )}
          </div>
        </div>

        {isFilterPanelExpanded && !isFilterPanelMinimized && (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flexGrow: 0.1 }}>
                <Typography
                  variant="h6"
                  style={{
                    cursor: 'pointer',
                    color: selectedTab === 'Filter' ? 'black' : 'gray',
                    textDecoration: selectedTab === 'Filter' ? 'underline' : 'none', // Apply underline style if selectedTab is "Filter"
                  }}
                  onClick={() => setSelectedTab('Filter')}
                >
                  Filter
                </Typography>
              </div>
              <div style={{ flexGrow: 0.1 }}>
                <Typography
                  variant="h6"
                  style={{
                    cursor: 'pointer',
                    color: selectedTab === 'Data Point' ? 'black' : 'gray',
                    textDecoration: selectedTab === 'Data Point' ? 'underline' : 'none', // Apply underline style if selectedTab is "Data Point"
                  }}
                  onClick={() => setSelectedTab('Data Point')}
                >
                  Data Point
                </Typography>
              </div>
              <Divider style={{ marginTop: '10px', marginBottom: '10px', height: '20px', backgroundColor: 'black', zIndex: '3000 !important' }} />
            </div>

            {selectedTab === 'Filter' && (
              <div>
                <div>
                  <Typography
                    variant="h6"
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={handleTangibleDropdownToggle}
                  >
                    Tangible {tangibleDropdownOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                  </Typography>
                  <Divider orientation="vertical" flexItem style={{ marginLeft: '10px', marginRight: '10px' }} />
                  {renderTangibleCheckboxes()}
                </div>
                <br />
                <div>
                  <Typography
                    variant="h6"
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={handleIntangibleDropdownToggle}
                  >
                    Intangible {intangibleDropdownOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                  </Typography>
                  {renderIntangibleCheckboxes()}
                </div>
              </div>
            )}


            {selectedTab === 'Data Point' && (
              <div>
                {selectedMarkerLocation ? (
                  <CreateDataPoint location={selectedMarkerLocation} onReadMoreClick={handleReadMoreClick} />
                ) : (<div style={{ color: 'black' }}>Please select a datapoint from the map!</div>)}
              </div>
            )}
          </>
        )}



        {isDataCardOpen && selectedLocation && (
          <div
            className="popup-overlay"
            style={{ backgroundColor: '#ededed', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', marginTop: '32px' }}
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


    </div >


  );

};

export default MapPage;



