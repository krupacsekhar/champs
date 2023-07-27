import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import DataCard from '../components/DataCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditForm from '../components/EditForm';
import { Edit } from '@mui/icons-material';
import axios from 'axios';
import EditOrLockButton from '../components/EditOrLockButton';


const ManageTask = () => {
  const [publishedDatapoints, setPublishedDatapoints] = useState([]);
  const [pendingDatapoints, setPendingDatapoints] = useState([]);
  const [selectedDatapoint, setSelectedDatapoint] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const validImageFormats = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];


  const handleViewMore = (datapoint) => {
    setSelectedDatapoint(datapoint);
  };


  const handleDeleteIconClick = (datapoint) => {
    setConfirmDelete(true);
    setSelectedDelete(datapoint)
  };

  const [userRole, setUserRole] = useState('')
  const [user, setUser] = useState('')

  const [userId, setUserId] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the bearer token is present in local storage
        const token = localStorage.getItem('token');

        if (!token) {
          setUserRole(''); // No token, set userRole to an empty string
          console.log('no token');
          return;
        }

        const response = await axios.get('https://champswebapi.azurewebsites.net/api/UserDetail/0', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const { id } = response.data;
        const { userRole } = response.data;

        setUserRole(userRole);

        setUserId(id);

        console.log({ userId });
      } catch (error) {
        setUserRole('err');
        console.error('Error:', error);
      }
    };

    fetchData().catch(error => {
      console.error('Error:', error);
    });
  }, []);




  useEffect(() => {
    // Fetch published and pending datapoints from the API
    fetch('https://champswebapi.azurewebsites.net/api/Entry')
      .then((response) => response.json())
      .then((data) => {
        const filteredPublishedDatapoints = data.filter((datapoint) => {
          const lastEntryStatus = datapoint.entryTimeline[datapoint.entryTimeline.length - 1]?.entryStatus;
          return (
            lastEntryStatus?.name === 'Approved' &&
            datapoint.isDeleted === false &&
            (datapoint.createdByUserDetailId === userId || datapoint.assigneeId === userId)
          );
        });
        const filteredPendingDatapoints = data.filter((datapoint) => {
          const lastEntryStatus = datapoint.entryTimeline[datapoint.entryTimeline.length - 1]?.entryStatus;
          return (
            lastEntryStatus?.name !== 'Approved' &&
            lastEntryStatus?.name !== 'Rejected' &&
            datapoint.isDeleted === false &&
            (datapoint.createdByUserDetailId === userId || datapoint.assigneeId === userId)
          );
        });
        setPublishedDatapoints(filteredPublishedDatapoints);
        setPendingDatapoints(filteredPendingDatapoints);
      })
      .catch((error) => console.log(error));
  }, []);

  const fetchPendingDatapoints = async () => {
    try {
      const response = await fetch('https://champswebapi.azurewebsites.net/api/Entry');
      const data = await response.json();

      const filteredPendingDatapoints = data.filter((datapoint) => {
        const lastEntryStatus = datapoint.entryTimeline[datapoint.entryTimeline.length - 1]?.entryStatus;
        return (
          lastEntryStatus?.name !== 'Approved' &&
          lastEntryStatus?.name !== 'Rejected' &&
          datapoint.isDeleted === false &&
          (datapoint.createdByUserDetailId === userId || datapoint.assigneeId === userId)
        );
      });

      setPendingDatapoints(filteredPendingDatapoints);
    } catch (error) {
      console.log(error);
    }
  };

  const token = localStorage.getItem('token');

  const handleDeleteConfirmation = async (shouldDelete) => {
    if (shouldDelete) {
      try {
        await axios.delete(`https://champswebapi.azurewebsites.net/api/Entry/${selectedDelete.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // After successful deletion, fetch and update pending datapoints
        await fetchPendingDatapoints();

      } catch (error) {
        console.log(error);
        // Handle error if needed
      }
    }

    setConfirmDelete(false);
  };



  const expert = userRole === "User" ? (false) : (true)

  const getFirstValidImage = (datapoint) => {
    const validFile = datapoint.entryFileDetail.find((file) => {
      const fileExtension = file.fileDetail.filePath.substring(file.fileDetail.filePath.lastIndexOf('.')).toLowerCase();
      return validImageFormats.includes(fileExtension);
    });

    return validFile ? validFile.fileDetail.filePath : null;
  };

  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setSelectedEntry(null);
  };

  const handleSaveEntry = (formData) => {
    // Perform PUT request to update the entry with formData
    // Replace the following code with your PUT request logic
    console.log('Saving entry:', formData);
    handleCloseEditForm();
  };



  const handleEditIconClick = (datapoint) => {
    setSelectedEntry({
      ...datapoint,
    });
    setEditFormOpen(true);
  };

  const handleEntryUpdate = (updatedEntry) => {
    setSelectedEntry(updatedEntry);
  };


  return (
    <div className="manage">
      <Container maxWidth="sm">
        <Typography variant="h4" className="heading">
          Manage Task
        </Typography>
        <Typography variant="h5" className="subheading">
          Your Pending Datapoints
        </Typography>
        <Paper className="table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pendingDatapoints.map((datapoint, index) => (
                <TableRow key={datapoint.id} className={index % 2 === 0 ? 'grey-row' : ''}>
                  <TableCell>{datapoint.title}</TableCell>
                  <TableCell>{datapoint.address?.addressLineOne || ''}</TableCell>
                  <TableCell className="table-cell-action">
                    <EditOrLockButton datapoint={datapoint} onEditIconClick={handleEditIconClick} />
                    <IconButton
                      style={{ color: '#CE1126' }}
                      aria-label="Delete"
                      onClick={() => handleDeleteIconClick(datapoint)}
                    >
                      <DeleteIcon />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </Paper>

        <Typography variant="h5" className="subheading">
          Your Published Datapoints
        </Typography>
        <div>
          {publishedDatapoints.map((datapoint) => (
            <Card key={datapoint.id} className="card">
              <Typography variant="h6" style={{ color: '#335058' }}>
                {datapoint.title}
              </Typography>
              {getFirstValidImage(datapoint) && (
                <img src={getFirstValidImage(datapoint)} alt="Datapoint Image" />
              )}
              <Typography>{datapoint.description}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: '#FCD116', alignSelf: 'flex-end' }}
                onClick={() => handleViewMore(datapoint)}
              >
                View More
              </Button>
            </Card>
          ))}
        </div>

        {selectedDatapoint && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button className="data-close-button" onClick={() => setSelectedDatapoint(null)}>
                X
              </button>
              {/* Render additional details for the selected datapoint */}
              <DataCard location={selectedDatapoint} />
            </div>
          </div>
        )}

        <Dialog className="edit-form" open={editFormOpen} onClose={handleCloseEditForm}>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogContent>
            {selectedEntry && (

              <EditForm
                selectedEntry={selectedEntry}
                expert={expert}
                entryID={selectedEntry.id}
                onUpdate={handleEntryUpdate}
              />

            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditForm}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDelete} onClose={() => handleDeleteConfirmation(false)}>
          <DialogTitle>Delete Entry</DialogTitle>
          <DialogContent>
            <DialogContentText color="#335058">
              Are you sure you want to delete your entry?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ backgroundColor: '#335058', color: 'white' }}
              onClick={() => handleDeleteConfirmation(true)}
            >
              Yes
            </Button>
            <Button
              style={{ backgroundColor: '#335058', color: 'white' }}
              onClick={() => handleDeleteConfirmation(false)}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageTask;
