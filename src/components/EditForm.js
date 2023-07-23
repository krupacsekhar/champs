import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';


const EditForm = ({ selectedEntry, expert, entryID, onUpdate }) => {
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const convertCulturalHeritageTypeIdToName = (id) => {
    switch (id) {
      case 1:
        return 'tangible';
      case 2:
        return 'intangible';
      default:
        return '';
    }
  };

  const convertEthnicGroupIdToName = (id) => {
    switch (id) {
      case 1:
        return 'Malay';
      case 2:
        return 'Chinese';
      case 3:
        return 'Iban';
      case 4:
        return 'Bidayuh';
      case 5:
        return 'Indian';
      default:
        return '';
    }
  };

  const convertCulturalHeritageCategoryIdToName = (id) => {
    switch (id) {
      case 1:
        return 'Heritage Sites';
      case 2:
        return 'Monuments';
      case 3:
        return 'Buildings';
      case 4:
        return 'Structures';
      case 5:
        return 'Ruins';
      case 6:
        return 'Street Art';
      case 7:
        return 'Fine Art/Crafts';
      case 8:
        return 'Food/Gastronomy';
      case 9:
        return 'Music';
      case 10:
        return 'Dance';
      case 11:
        return 'Rituals';
      case 12:
        return 'Folk Tales';
      case 13:
        return 'Oral Traditions/Stories';
      case 14:
        return 'Cultural Festivals/Events';
      case 15:
        return 'Traditional Knowledge';
      default:
        return '';
    }
  };
  const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];

  const validMedia = (media) => {
    return media?.filter((imageUrl) => {
      const fileExtension = imageUrl.substring(imageUrl.lastIndexOf('.')).toLowerCase();
      return validImageFormats.includes(fileExtension);
    });
  };

  const [formData, setFormData] = useState(
    {
      heritageType: convertCulturalHeritageTypeIdToName(selectedEntry?.culturalHeritageTypeId) || '',
      culturalHeritageCategory: convertCulturalHeritageCategoryIdToName(selectedEntry?.culturalHeritageCategoryId) || '',
      ethnicGroup: convertEthnicGroupIdToName(selectedEntry?.ethnicGroupId) || '',
      title: selectedEntry?.title || '',
      addressLineOne: selectedEntry?.address?.addressLineOne || '',
      addressLineTwo: selectedEntry?.address?.addressLineTwo || '',
      addressLineThree: selectedEntry?.address?.addressLineThree || '',
      postcode: selectedEntry?.address?.postcode || '',
      city: selectedEntry?.address?.city || '',
      state: selectedEntry?.address?.state || '',
      country: selectedEntry?.address?.country || '',
      latitude: selectedEntry?.latitude || '',
      longitude: selectedEntry?.longitude || '',
      content: selectedEntry?.content || '',
      description: selectedEntry?.description || '',
      about: selectedEntry?.about || '',
      others: selectedEntry?.others || '', // Add others field if it exists in the selectedEntry
      images: validMedia(selectedEntry?.entryFileDetail?.map((file) => file.fileDetail.filePath)) || [],
      isSubmitted: false,
    }
  );


  useEffect(() => {
    // Move the state initialization to a separate function
    const initializeFormData = (entry) => {
      setFormData({
        heritageType: convertCulturalHeritageTypeIdToName(selectedEntry?.culturalHeritageTypeId) || '',
        culturalHeritageCategory: convertCulturalHeritageCategoryIdToName(selectedEntry?.culturalHeritageCategoryId) || '',
        ethnicGroup: convertEthnicGroupIdToName(selectedEntry?.ethnicGroupId) || '',
        title: selectedEntry?.title || '',
        addressLineOne: selectedEntry?.address?.addressLineOne || '',
        addressLineTwo: selectedEntry?.address?.addressLineTwo || '',
        addressLineThree: selectedEntry?.address?.addressLineThree || '',
        postcode: selectedEntry?.address?.postcode || '',
        city: selectedEntry?.address?.city || '',
        state: selectedEntry?.address?.state || '',
        country: selectedEntry?.address?.country || '',
        latitude: selectedEntry?.latitude || '',
        longitude: selectedEntry?.longitude || '',
        content: selectedEntry?.content || '',
        description: selectedEntry?.description || '',
        about: selectedEntry?.about || '',
        others: selectedEntry?.others || '', // Add others field if it exists in the selectedEntry
        images: validMedia(selectedEntry?.entryFileDetail?.map((file) => file.fileDetail.filePath)) || [],
        isSubmitted: false,
      });
    };

    // Call the initialization function whenever the selectedEntry prop changes
    if (selectedEntry) {
      initializeFormData(selectedEntry);
    }
  }, [selectedEntry]);


  const token = localStorage.getItem('token');
  const [publish, setPublish] = useState(false);
  const [reject, setReject] = useState(false);

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
        id: entryID,
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

      /*const addressPayload = {
        addressLineOne: "formData.addressLineOne",
        addressLineTwo: "formData.addressLineTwo",
        addressLineThree: "formData.addressLineThree",
        postcode: "formData.postcode",
        city: "formData.city",
        state: "formData.state",
        country: "formData.country",
      };
  
      const data = {
        ethnicGroupId: 1,
        culturalHeritageTypeId: 1,
        culturalHeritageCategoryId: 1,
        address: addressPayload,
        latitude: 2.3,
        longitude: 1.2,
        title: "hello",
        content: "content",
        description: "desc",
        about: "formData.about",
        others: "formData.other",
        id: entryID,
      };*/

      const formData1 = new FormData();
      formData1.append('model', JSON.stringify(data));

      if (formData.images && formData.images.length > 0) {
        for (const file of formData.images) {
          formData1.append('files', file);
        }
      }

      const response = await fetch('https://champswebapi.azurewebsites.net/api/Entry', {
        method: 'PUT',
        body: formData1,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (publish) {
        await axios.get(`https://champswebapi.azurewebsites.net/api/Entry/${entryID}/3`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      if (reject) {
        await axios.get(`https://champswebapi.azurewebsites.net/api/Entry/${entryID}/4`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }


      if (response.ok) {
        // Call the onUpdate function with the updated entry data
        onUpdate(formData);

        console.log('Form submitted successfully!');


        // Set the isSavedSuccessfully state variable to true
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

  const handlePublish = () => {
    // Remove the token from local storage	
    setPublish(true)
  };
  const handleReject = () => {
    // Remove the token from local storage	
    setReject(true)
  };
  const publishButton = expert ? (<Button variant="contained" className="submit-button" type="submit" onClick={handlePublish}>
    Publish
  </Button>) : (<div></div>)
  const rejectButton = expert ? (<Button variant="contained" className="submit-button" type="submit" onClick={handleReject}>
    Reject
  </Button>) : (<div></div>)

  const handleViewTask = () => {
    navigate('/manage-task');
  };

  return (
    <Form onSubmit={handleSubmit}>

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
        {formData.images.map((imageUrl, index) => (
          <div key={index}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="remove-image"
              onClick={() => handleFileRemove(index)}
            >
              <Close />
            </IconButton>
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="data-carousel-image"
            />
          </div>
        ))}
      </Form.Group>

      <div>
        <Button variant="contained" className="submit-button" type="submit">
          Save
        </Button>
        {publishButton}
        {rejectButton}
        <div>
          {isSavedSuccessfully && (
            <Alert severity="success" onClose={() => setIsSavedSuccessfully(false)}>
              Saved successfully!
            </Alert>
          )}
        </div>
      </div>
    </Form>
  );
};

export default EditForm;