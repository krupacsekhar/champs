import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';


const UploadForm1 = () => {
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const [formData, setFormData] = useState({
    heritageType: '',
    culturalHeritageCategory: '',
    ethnicGroup: '',
    title: '',
    addressLineOne: '',
    addressLineTwo: '',
    addressLineThree: '',
    postcode: '',
    city: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    content: '',
    description: '',
    about: '',
    others: '',
    images: [],
    isSubmitted: false,
  });
  const token = localStorage.getItem('token');

  const heritageTypeOptions = [
    { label: 'Tangible', value: 'tangible' },
    { label: 'Intangible', value: 'intangible' },
  ];

  const tangibleCategoryOptions = [
    'Fine Art/Crafts',
    'Street Art',
    'Ruins',
    'Structures',
    'Buildings',
    'Monuments',
    'Heritage Sites',
  ];

  const intangibleCategoryOptions = [
    'Traditional knowledge',
    'Cultural Festivals/Events',
    'Oral Traditions/Stories',
    'Folk Tales',
    'Rituals',
    'Dance',
    'Music',
    'Food/Gastronomy',
  ];

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
    Structures: 4,
    Ruins: 5,
    'Street Art': 6,
    'Fine Art/Crafts': 7,
    'Food/Gastronomy': 8,
    Music: 9,
    Dance: 10,
    Rituals: 11,
    'Folk Tales': 12,
    'Oral Traditions/Stories': 13,
    'Cultural Festivals/Events': 14,
    'Traditional Knowledge': 15,
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
        state: formData.state,
        country: formData.country,
      };

      const data = {
        ethnicGroupId: ethnicGroupIdMapping[formData.ethnicGroup],
        culturalHeritageTypeId: culturalHeritageTypeIdMapping[formData.heritageType],
        culturalHeritageCategoryId: culturalHeritageCategoryIdMapping[formData.culturalHeritageCategory],
        title: formData.title,
        address: addressPayload,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        content: formData.content,
        description: formData.description,
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

  const handleHeritageTypeChange = (event) => {
    const { value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      heritageType: value,
      culturalHeritageCategory: prevFormData.culturalHeritageCategory || '',
    }));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      culturalHeritageCategory: value,
    }));
  };

  const culturalHeritageCategoryOptions =
    formData.heritageType === 'tangible'
      ? tangibleCategoryOptions
      : formData.heritageType === 'intangible'
        ? intangibleCategoryOptions
        : [];

  const handleViewTask = () => {
    navigate('/manage-task');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h4" className="heading">
        Upload
      </Typography>
      <Form.Group controlId="heritageType">
        <Form.Label className="label">Heritage Type</Form.Label>
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

      {formData.heritageType && (
        <Form.Group controlId="culturalHeritageCategory">
          <Form.Label className="label">Cultural Heritage Category</Form.Label>
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
        </Form.Group>
      )}

      <Form.Group controlId="ethnicGroup">
        <Form.Label className="label">Ethnic Group</Form.Label>
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

      <Form.Group controlId="title">
        <Form.Label className="label">Title</Form.Label>
        <TextField
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="address">
        <Form.Label className="label">Address</Form.Label>
        <TextField
          name="addressLineOne"
          label="Address Line 1"
          value={formData.addressLineOne}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="addressLineTwo"
          label="Address Line 2"
          value={formData.addressLineTwo}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="addressLineThree"
          label="Address Line 3"
          value={formData.addressLineThree}
          onChange={handleChange}
          fullWidth
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
        <TextField
          name="state"
          label="State"
          value={formData.state}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="country"
          label="Country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="latitude">
        <Form.Label className="label">Latitude</Form.Label>
        <TextField
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="longitude">
        <Form.Label className="label">Longitude</Form.Label>
        <TextField
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="content">
        <Form.Label className="label">Content</Form.Label>
        <TextField
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label className="label">Description</Form.Label>
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

      <Form.Group controlId="about">
        <Form.Label className="label">About</Form.Label>
        <TextField
          name="about"
          value={formData.about}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="others">
        <Form.Label className="label">Others</Form.Label>
        <TextField
          name="others"
          value={formData.others}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
        />
      </Form.Group>

      <Form.Group controlId="images">
        <Form.Label className="label">Images/Videos:</Form.Label>
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
