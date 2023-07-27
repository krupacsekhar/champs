import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataPointDetailsPage from './DataPointDetailsPage';
import { Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Container, Row, Col } from "react-bootstrap";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const SearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleButtonClick = (category) => {
    setSelectedCategory(category);
    navigate(`/datapointdetails/${encodeURIComponent(category)}`);
  };

  const tangibleCategories = [
    'Fine Art/Crafts',
    'Street Art',
    'Buildings',
    'Monuments',
    'Heritage Sites',
  ];

  const intangibleCategories = [
    'Traditional Knowledge',
    'Cultural Festivals/Events',
    'Oral Traditions/Stories',
    'Rituals',
    'Dance',
    'Music',
    'Food/Gastronomy',
  ];

  const popupContent = {
    'Heritage Sites': 'Any place, site or area which is, in the opinion of the Director, to be preserved by reason of its archaeological, paleontological, religious, traditional or historic interest or value.',
    Monuments: 'Any building, port, earthwork, standing stone, keramat, cave, or other structure, erection or excavation, tomb, tumulus or other place of internment, or any other immovable property of a like nature or any part or remains.',
    Buildings: 'Classes of building which are categorised into three classes: Class I: Historical buildings which are over one hundred years old, have well documented history either public or private, and are declared as such before the date of coming into force of this Ordinance amendment. The subsequent conservation and use of such building can only be approved by Dewan Undangan Negeri. Class II: Historical buildings which are over one hundred years old, have documented records, been in continuous use, either public or private, and are not declared as such on the date of this amendment. The conservation and use of such building shall be decided by Majlis Mesyuarat Kerajaan Negeri on the recommendation of the Sarawak Museum Department. Class III: Historical buildings which are less than one hundred years old, have documented history and of great significance',
    'Street Art': 'An appropriation of urban and suburban space through an artistic approach, whatever its nature. Murals, art installations, sculptures, etc.',
    'Fine Art/Crafts': 'Products that are produced by artisans, either completely by hand or with the help of hand-tools or even mechanical means, as long as the direct manual contribution of the artisan remains the most substantial component of the finished product. \n The special nature of artisanal products derives from their distinctive features, which can be utilitarian, aesthetic, artistic, creative, culturally attached, decorative, functional, traditional, religiously and socially symbolic and significant',
    'Food/Gastronomy': 'Food has   both   a   natural   and   a cultural component   that   contributes   to   its authenticity, uniqueness, and   cultural identity. The natural includes the unique physical environment of a region. The cultural includes values and attitudes of the local community.',
    Music: 'Besides standing on its own, it is an integral part of other performing art forms and other domains of intangible cultural heritage including rituals, festive events or oral traditions. Performed in a wide variety of contexts such as marriages, funerals, rituals and initiations, festivities, all kinds of entertainment as well as many other social functions.',
    Dance: 'Though very complex, may be described simply as ordered bodily movements, usually performed to music. Apart from its physical aspect, the rhythmic movements, steps and gestures of dance often express a sentiment or mood or illustrate a specific event or daily act, such as religious dances and those representing hunting or warfare.',
    Rituals: 'Often take place at special times and places and remind a community of aspects of its worldview and history. In some cases, access to rituals may be restricted to certain members of the community (eg: initiation rites, burial ceremonies).',
    'Oral Traditions/Stories': 'Variety of spoken forms including proverbs, riddles, tales, nursery rhymes, legends, myths, epic songs and poems, charms, prayers, chants, songs, dramatic performances. Used to pass on knowledge, cultural and social values and collective memory. Can be used by entire communities or particular social groups.',
    'Cultural Festivals/Events': 'Expression and celebration of the traditions of a particular ethnic or religious group. Events where art and culture are the main focus. May or may not be commercial in nature.',
    'Traditional Knowledge': 'Knowledge, know-how, skills and practices that are developed, sustained and passed on from generation to generation within a community, forming part of its cultural or spiritual identity.',
  };

  const renderButtons = (categories) => {
    return categories.map((category) => (
      <div key={category} className="button-wrapper">
        <Button
          className="search-button"
          variant="contained"
          onClick={() => handleButtonClick(category)}
        >
          {category}
        </Button>
        <Tooltip title={popupContent[category]}>
          <InfoIcon className="info-icon" color="disabled" />
        </Tooltip>
      </div>
    ));
  };

  return (
    <div className="search-page">
      <div className="search-container">

        {/* Intangible Cultural Heritage */}
        {!selectedCategory && (
          <>
            <Button
              className="search-button"
              variant="contained"
              onClick={() => setSelectedCategory('Intangible')}        >
              Intangible Cultural Heritage

            </Button>

            <Button
              className="search-button"
              variant="contained"
              onClick={() => setSelectedCategory('Tangible')}        >
              Tangible Cultural Heritage

            </Button>

          </>
        )}

        {/* Display only the selected category */}
        {selectedCategory && (
          <>
            <h2 className="search-heading">
              <KeyboardBackspaceIcon
                onClick={() => setSelectedCategory('')}
                style={{ fontWeight: 'bold', marginRight: '10px' }}
              />
              {selectedCategory} Cultural Heritage
            </h2>
            <div className="search-button-group">
              {selectedCategory === 'Intangible'
                ? renderButtons(intangibleCategories)
                : renderButtons(tangibleCategories)}
            </div>

          </>
        )}
      </div>

    </div>
  );
};

export default SearchPage;
