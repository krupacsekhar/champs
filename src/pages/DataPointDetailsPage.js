import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import DataCard from '../components/DataCard';

const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];

const CreateDataPoint = ({ location, onCardClick }) => {
  const media = location.entryFileDetail
    .filter(file => validImageFormats.some(format => file.fileDetail.filePath.toLowerCase().endsWith(format)))
    .map(file => file.fileDetail.filePath);

  const handleCardClick = () => {
    onCardClick(location);
  };

  return (
    <Card
      sx={{ maxWidth: 700, margin: '16px auto', backgroundColor: 'white' }}
      onClick={handleCardClick}
    >
      {media.length > 0 && (
        <CardMedia
          component="img"
          src={media[0]}
          alt="Data Point"
        />
      )}
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {location.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {location.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DataPointDetailsPage = () => {
  const { category } = useParams();
  const [filteredDataPoints, setFilteredDataPoints] = useState([]);
  const [isDataCardOpen, setIsDataCardOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchDataPoints = async () => {
      try {
        const response = await fetch('https://champswebapi.azurewebsites.net/api/Entry');
        const data = await response.json();
        const filteredData = data.filter(entry => entry.culturalHeritageCategory?.name?.toLowerCase() === category.toLowerCase());
        const extraFilteredData = filteredData.filter((datapoint) => {
          const lastEntryStatus = datapoint.entryTimeline[datapoint.entryTimeline.length - 1]?.entryStatus;
          return (
            lastEntryStatus?.name === 'Approved' &&
            datapoint.isDeleted === false
          );
        });
        setFilteredDataPoints(extraFilteredData);
      } catch (error) {
        console.error('Error fetching data points:', error);
      }
    };

    fetchDataPoints();
  }, [category]);

  const handleCardClick = (location) => {
    setSelectedLocation(location);
    setIsDataCardOpen(true);
  };

  const handleDataCardClose = () => {
    setIsDataCardOpen(false);
    setSelectedLocation(null);
  };

  return (
    filteredDataPoints.length === 0 ? (
      <div className="dpd">
        <div className="category-container">

          <h1>There are no datapoints under {category} yet!</h1>
        </div>
      </div>
    ) : (
      <div className="dpd">
        <div className="category-container">
          <h1>{category}</h1>
        </div>
        {filteredDataPoints.map((dataPoint) => (
          <CreateDataPoint
            key={dataPoint.id}
            location={dataPoint}
            onCardClick={handleCardClick}
          />
        ))}
        {isDataCardOpen && selectedLocation && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button className="data-close-button" onClick={handleDataCardClose}>
                X
              </button>
              <DataCard location={selectedLocation} />
            </div>
          </div>
        )}
      </div>)
  );
};

export default DataPointDetailsPage;


/*filteredDataPoints.length === 0 ? (
      <div className="dpd">
        <h1>There are no datapoints under this category yet!</h1>
      </div>
    ) : (
      <div className="dpd">
        {filteredDataPoints.map((dataPoint) => (
          <CreateDataPoint
            key={dataPoint.id}
            location={dataPoint}
          />
        ))}
      </div>
    )*/
