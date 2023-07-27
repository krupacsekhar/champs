import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Popover, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Import geolocation functions from navigator
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};


const UploadForm1 = () => {
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const [userGeolocation, setUserGeolocation] = useState({
    latitude: '',
    longitude: '',
  });

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Set the latitude and longitude in the userGeolocation state
          setUserGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          // Set the latitude and longitude in the formData state
          setFormData((prevFormData) => ({
            ...prevFormData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          // Handle errors here, e.g., show a user-friendly message
        },
        geolocationOptions
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case when geolocation is not supported
    }
  };



  const [formData, setFormData] = useState({
    heritageType: '',
    culturalHeritageCategory: '',
    language: '',
    creativeCommon: '',
    ethnicGroup: '',
    title: '',
    addressLineOne: '',
    addressLineTwo: '',
    addressLineThree: '',
    postcode: '',
    city: 'Kuching',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    content: '',
    description: '',
    descriptionTranslate: '',
    about: '',
    others: '',
    images: [],
    isSubmitted: false,
  });
  const token = localStorage.getItem('token');

  const popupContent = {
    'Heritage Sites': 'Any place, site or area which is, in the opinion of the Director, to be preserved by reason of its archaeological, paleontological, religious, traditional or historic interest or value.',
    Monuments: 'Any building, port, earthwork, standing stone, keramat, cave, or other structure, erection or excavation, tomb, tumulus or other place of internment, or any other immovable property of a like nature or any part or remains.',
    Buildings: 'Classes of building which are categorised into three classes: Class I: Historical buildings which are over one hundred years old, have well documented history either public or private, and are declared as such before the date of coming into force of this Ordinance amendment. The subsequent conservation and use of such building can only be approved by Dewan Undangan Negeri. Class II: Historical buildings which are over one hundred years old, have documented records, been in continuous use, either public or private, and are not declared as such on the date of this amendment. The conservation and use of such building shall be decided by Majlis Mesyuarat Kerajaan Negeri on the recommendation of the Sarawak Museum Department. Class III: Historical buildings which are less than one hundred years old, have documented history and of great significance',
    'Street Art': 'An appropriation of urban and suburban space through an artistic approach, whatever its nature. Murals, art installations, sculptures, etc.',
    'Fine Art/Crafts': 'Products that are produced by artisans, either completely by hand or with the help of hand-tools or even mechanical means, as long as the direct manual contribution of the artisan remains the most substantial component of the finished product. \n The special nature of artisanal products derives from their distinctive features, which can be utilitarian, aesthetic, artistic, creative, culturally attached, decorative, functional, traditional, religiously and socially symbolic and significant. An item can be considered as handicraft is more than 70% is handmade',
    'Food/Gastronomy': 'Food has   both   a   natural   and   a cultural component   that   contributes   to   its authenticity, uniqueness, and   cultural identity. The natural includes the unique physical environment of a region. The cultural includes values and attitudes of the local community.',
    Music: 'Besides standing on its own, it is an integral part of other performing art forms and other domains of intangible cultural heritage including rituals, festive events or oral traditions. Performed in a wide variety of contexts such as marriages, funerals, rituals and initiations, festivities, all kinds of entertainment as well as many other social functions.',
    Dance: 'Though very complex, may be described simply as ordered bodily movements, usually performed to music. Apart from its physical aspect, the rhythmic movements, steps and gestures of dance often express a sentiment or mood or illustrate a specific event or daily act, such as religious dances and those representing hunting or warfare.',
    Rituals: 'Often take place at special times and places and remind a community of aspects of its worldview and history. In some cases, access to rituals may be restricted to certain members of the community (eg: initiation rites, burial ceremonies).',
    'Oral Traditions/Stories': 'Variety of spoken forms including proverbs, riddles, tales, nursery rhymes, legends, myths, epic songs and poems, charms, prayers, chants, songs, dramatic performances. Used to pass on knowledge, cultural and social values and collective memory. Can be used by entire communities or particular social groups.',
    'Cultural Festivals/Events': 'Expression and celebration of the traditions of a particular ethnic or religious group. Events where art and culture are the main focus. May or may not be commercial in nature.',
    'Traditional Knowledge': 'Knowledge, know-how, skills and practices that are developed, sustained and passed on from generation to generation within a community, forming part of its cultural or spiritual identity.',
  };


  const heritageTypeOptions = [
    { label: 'Tangible', value: 'tangible' },
    { label: 'Intangible', value: 'intangible' },
  ];

  const tangibleCategoryOptions = [
    'Fine Art/Crafts',
    'Street Art',
    'Buildings',
    'Monuments',
    'Heritage Sites',
  ];

  const intangibleCategoryOptions = [
    'Traditional knowledge',
    'Cultural Festivals/Events',
    'Oral Traditions/Stories',
    'Rituals',
    'Dance',
    'Music',
    'Food/Gastronomy',
  ];

  const creativeCommonOptions = [
    'CC BY',
    'CC BY-SA',
    'CC BY-NC',
    'CC BY-NC-SA',
    'CC BY-ND',
    'CC BY-NC-ND'

  ];

  const languageOptions = ['Malay/English', 'Tamil', 'Bahasa Sarawak', 'Bidayuh', 'Iban', 'Mandarin'];

  const languageIdMapping = {
    "Malay/English": 1,
    Bidayuh: 2,
    Tamil: 3,
    "Bahasa Sarawak": 4,
    "Mandarin": 5,
    Iban: 6
  };


  const ethnicGroupOptions = ['Bidayuh', 'Chinese', 'Iban', 'Indian', 'Malay'];

  const ethnicGroupIdMapping = {
    Malay: 1,
    Chinese: 2,
    Iban: 3,
    Bidayuh: 4,
    Indian: 5,
  };

  const culturalHeritageTypeIdMapping = {
    tangible: 1,
    intangible: 2,
  };

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

  const creativeCommonIdMapping = {
    'CC BY': 1,
    'CC BY-SA': 2,
    'CC BY-NC': 3,
    'CC BY-NC-SA': 4,
    'CC BY-ND': 5,
    'CC BY-NC-ND': 6

  };

  const navigate = useNavigate();

  {/*const assignHeritageExpert = async () => {
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

      const assignedExpert = response.data.some(
        (favoriteEntry) => favoriteEntry.id === location.id
      );

    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };*/}


  /*const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const addressPayload = {
        addressLineOne: formData.addressLineOne,
        addressLineTwo: formData.addressLineTwo,
        addressLineThree: formData.addressLineThree,
        postcode: formData.postcode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };


      const formData1 = new FormData();
      const items = {
        'ethnicGroupId': ethnicGroupIdMapping[formData.ethnicGroup],
        'culturalHeritageTypeId': culturalHeritageTypeIdMapping[formData.heritageType],
        'culturalHeritageCategoryId': culturalHeritageCategoryIdMapping[formData.culturalHeritageCategory],
        'title': JSON.stringify(formData.title),
        'address': JSON.stringify(addressPayload),
        'latitude': formData.latitude,
        'longitude': formData.longitude,
        'content': JSON.stringify(formData.content),
        'description': JSON.stringify(formData.description),
        'about': JSON.stringify(formData.about),
        'others': JSON.stringify(formData.others)
      }

      formData1.append('model', JSON.stringify(items))
      if (formData.images && formData.images.length > 0) {
        for (const file of formData.images) {
          formData.append('files', file);
        }
      }*/
  const handleSubmit = async (event) => {



    event.preventDefault();
    try {
      const addressPayload = {
        addressLineOne: formData.addressLineOne,
        addressLineTwo: formData.addressLineTwo,
        addressLineThree: formData.addressLineThree,
        postcode: formData.postcode,
        city: formData.city,
        state: 'Sarawak',
        country: 'Malaysia',
      };

      const data = {
        ethnicGroupId: ethnicGroupIdMapping[formData.ethnicGroup],
        entryLanguageId: languageIdMapping[formData.language],
        culturalHeritageTypeId: culturalHeritageTypeIdMapping[formData.heritageType],
        culturalHeritageCategoryId: culturalHeritageCategoryIdMapping[formData.culturalHeritageCategory],
        creativeCommonId: creativeCommonIdMapping[formData.creativeCommon],
        title: formData.title,
        address: addressPayload,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        content: formData.content,
        description: formData.description,
        descriptionTranslate: formData.descriptionTranslate,
        about: formData.about,
        others: formData.others,

      };

      const formData1 = new FormData();
      formData1.append('model', JSON.stringify(data));

      if (formData.images && formData.images.length > 0) {
        for (const file of formData.images) {
          formData1.append('files', file);
        }
      }

      const response = await fetch('https://champswebapi.azurewebsites.net/api/Entry', {
        method: 'POST',
        body: formData1,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });


      /*event.preventDefault();
  
      try {
        const formData1 = new FormData();
  
        const items = {
          "title": "test1",
          "ethnicGroupId": 1,
          "culturalHeritageTypeId": 1,
          "culturalHeritageCateforyId": 1,
          "content": "test",
          "description": "test",
          "about": "test",
          "others": "test",
          "latitude": 2.3,
          "longitude": 115.80,
          "address": {
            addressLineOne: "test",
            addressLineTwo: "test",
            addressLineThree: "test",
            postcode: 1234,
            city: "test",
            state: "test",
            country: "test"
          }
  
        }
  
        formData1.append("model", JSON.stringify(items));

      const response = await fetch('https://champswebapi.azurewebsites.net/api/Entry', {
        method: 'POST',
        body: formData1,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });*/

      if (response.ok) {
        console.log('Form submitted successfully!');
        setFormData((prevFormData) => ({
          ...prevFormData,
          isSubmitted: true,
        }));
        setIsSavedSuccessfully(true);

      } else {
        console.error('Error submitting the form.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };




  const handleChange = (event) => {
    const { name, value, type } = event.target;

    // Custom validation for Latitude and Longitude fields

    // Handle other fields as before
    const fieldValue = type === 'file' ? event.target.files : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));

  };


  const handleFileChange = (event) => {
    const files = event.target.files;
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...Array.from(files)],
    }));
  };

  const handleFileRemove = (index) => {
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.images];
      updatedImages.splice(index, 1);
      return {
        ...prevFormData,
        images: updatedImages,
      };
    });
  };

  const culturalHeritageCategoryOptions =
    formData.heritageType === 'tangible'
      ? tangibleCategoryOptions
      : formData.heritageType === 'intangible'
        ? intangibleCategoryOptions
        : [];

  const cPopupContent = {
    'CC BY': 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.',
    'CC BY-SA': 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use. If you remix, adapt, or build upon the material, you must license the modified material under identical terms.',
    'CC BY-NC': 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. ',
    'CC BY-NC-SA': 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. If you remix, adapt, or build upon the material, you must license the modified material under identical terms.',
    'CC BY-ND': 'This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, and only so long as attribution is given to the creator. The license allows for commercial use.',
    'CC BY-NC-ND': 'This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, for noncommercial purposes only, and only so long as attribution is given to the creator.'
  }

  // State to track the anchor element for the popup
  const [anchorEl, setAnchorEl] = useState(null);

  // Function to handle opening the popup
  const handlePopupOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the popup
  const handlePopupClose = () => {
    setAnchorEl(null);
  };

  // Get the popup content based on the selected cultural heritage category
  const selectedCategory = formData.culturalHeritageCategory;
  const popupText = popupContent[selectedCategory] || 'select a category';

  // State to track the anchor element for the popup
  const [canchorEl, setcAnchorEl] = useState(null);

  // Function to handle opening the popup
  const handlecPopupOpen = (event) => {
    setcAnchorEl(event.currentTarget);
  };

  // Function to handle closing the popup
  const handlecPopupClose = () => {
    setcAnchorEl(null);
  };

  // Get the popup content based on the selected cultural heritage category
  const cselectedCategory = formData.creativeCommon;
  const cpopupText = cPopupContent[cselectedCategory] || 'select a category';



  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h4" className="heading">
        Upload
      </Typography>
      <Form.Group controlId="heritageType">
        <Form.Label className="label">Cultural Heritage</Form.Label>
        <Select
          name="heritageType"
          value={formData.heritageType}
          onChange={handleChange}
          fullWidth
          required
        >
          {heritageTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Form.Group>

      <Form.Group controlId="culturalHeritageCategory">
        <div className="label-container">
          <Form.Label className="label">Cultural Heritage Category</Form.Label>
          {formData.culturalHeritageCategory && (
            <InfoIcon
              className="info-icon"
              fontSize="small"
              color="disabled"
              onClick={handlePopupOpen}
            />
          )}
        </div>
        <Select
          name="culturalHeritageCategory"
          value={formData.culturalHeritageCategory}
          onChange={handleChange}
          fullWidth
          required
        >
          {culturalHeritageCategoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {/* Add the Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopupClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography sx={{ p: 2 }}>{popupText}</Typography>
        </Popover>
      </Form.Group>





      <Form.Group controlId="ethnicGroup">
        <Form.Label className="label">Community</Form.Label>
        <Select
          name="ethnicGroup"
          value={formData.ethnicGroup}
          onChange={handleChange}
          fullWidth
          required
        >
          {ethnicGroupOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Form.Group>

      <Form.Group controlId="creativeCommon">
        <div className="label-container">
          <Form.Label className="label">Creative Common</Form.Label>
          {formData.creativeCommon && (
            <InfoIcon
              className="info-icon"
              fontSize="small"
              color="disabled"
              onClick={handlecPopupOpen}
            />
          )}
        </div>
        <Select
          name="creativeCommon"
          value={formData.creativeCommon}
          onChange={handleChange}
          fullWidth
          required
        >
          {creativeCommonOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {/* Add the Popover */}
        <Popover
          open={Boolean(canchorEl)}
          anchorEl={canchorEl}
          onClose={handlecPopupClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography sx={{ p: 2 }}>{cpopupText}</Typography>
        </Popover>
      </Form.Group>

      <Form.Group controlId="title">
        <Form.Label className="label">Short Informative Title of the Element</Form.Label>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label className="label">Location</Form.Label>
        <TextField
          name="addressLineOne"
          label="Address"
          value={formData.addressLineOne}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="postcode"
          label="Postcode"
          value={formData.postcode}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>


      <Form.Group controlId="latitude">
        <Form.Label className="label">Latitude</Form.Label>
        <TextField
          name="latitude"
          value={userGeolocation.latitude} // Use userGeolocation.latitude here
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="longitude">
        <Form.Label className="label">Longitude</Form.Label>
        <TextField
          name="longitude"
          value={userGeolocation.longitude} // Use userGeolocation.longitude here
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>


      <Button variant="contained" onClick={getGeolocation} sx={{ backgroundColor: '#FCD116', color: 'black', marginTop: '10px', marginBottom: '7px' }}>
        Get Geolocation
      </Button>

      <Form.Group controlId="language">
        <Form.Label className="label">Language of Description</Form.Label>
        <Select
          name="language"
          value={formData.language}
          onChange={handleChange}
          fullWidth
          required
        >
          {languageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label className="label">Description of the element (150 words max)</Form.Label>
        <TextField
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
        />
      </Form.Group>

      {formData.language !== "Malay/English" && formData.language && (
        <Form.Group controlId="descriptionTranslate">
          <Form.Label className="label">Please provide a Malay/English Translation of the Description (150 words max)</Form.Label>
          <TextField
            name="descriptionTranslate"
            value={formData.descriptionTranslate}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
        </Form.Group>
      )}




      <Form.Group controlId="images">
        <Form.Label className="label">Files:</Form.Label>
        <input type="file" multiple onChange={handleFileChange} />
        {formData.images.map((image, index) => (
          <div key={index}>
            <p>{image.name}</p>
            <Button variant="contained" onClick={() => handleFileRemove(index)}>
              Remove
            </Button>
          </div>
        ))}
      </Form.Group>

      <Button variant="contained" className="submit-button" type="submit">
        Submit
      </Button>
      <div>
        {isSavedSuccessfully && (
          <Alert severity="success" onClose={() => setIsSavedSuccessfully(false)}>
            Saved successfully!
          </Alert>
        )}
      </div>
    </Form>
  );
};

export default UploadForm1;
