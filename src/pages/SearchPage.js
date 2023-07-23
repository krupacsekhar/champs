import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DataPointDetailsPage from './DataPointDetailsPage';


const SearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    navigate(`/datapointdetails/${encodeURIComponent(category)}`);
  };

  const intangibleCategories = [
    'Dance',
    'Music',
    'Rituals',
    'Food/Gastronomy',
    'Folk Tales',
    'Oral Traditions/Stories',
    'Cultural Festivals/Events',
    'Traditional Knowledge'
  ];

  const tangibleCategories = [
    'Heritage Sites',
    'Monuments',
    'Buildings',
    'Structures',
    'Ruins',
    'Fine Art/Crafts',
    'Street Art'
  ];

  const renderButtons = (categories) => {
    return categories.map((category) => (
      <Button
        key={category}
        className="search-button"
        variant="contained"
        onClick={() => handleButtonClick(category)}
      >
        {category}
      </Button>
    ));
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2 className="search-heading">Intangible Cultural Heritage</h2>
        <div className="search-button-group">
          {renderButtons(intangibleCategories)}
        </div>

        <h2 className="search-heading">Tangible Cultural Heritage</h2>
        <div className="search-button-group">
          {renderButtons(tangibleCategories)}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
