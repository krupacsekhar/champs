import React, { useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DataPoint from '../components/DataPoint';

/*so far j a copy of manage task*/

const ManageTask = () => {
  const publishedDatapoints = [
    { id: 1, text: 'Published Datapoint 1' },
    { id: 2, text: 'Published Datapoint 2' },
    { id: 3, text: 'Published Datapoint 3' },
  ];

  const pendingDatapoints = [
    { id: 1, name: 'Item 1', address: 'Address 1' },
    { id: 2, name: 'Item 2', address: 'Address 2' },
    { id: 3, name: 'Item 3', address: 'Address 3' },
  ];

  const [selectedDatapoint, setSelectedDatapoint] = useState(null);

  const handleViewMore = (datapoint) => {
    setSelectedDatapoint(datapoint);
  };

  return (
    <div className="manage">
      <Container maxWidth="sm">
        <Typography variant="h4" className="heading">
          Manage Task
        </Typography>

        <Typography variant="h5" className="subheading">Pending Datapoints</Typography>
        <Paper className="table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pendingDatapoints.map((datapoint, index) => (
                <TableRow key={datapoint.id} className={index % 2 === 0 ? 'grey-row' : ''}>
                  <TableCell>{datapoint.name}</TableCell>
                  <TableCell>{datapoint.address}</TableCell>
                  <TableCell className="table-cell-action">
                    <IconButton style={{ color: '#335058' }} aria-label="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton style={{ color: '#335058' }} aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Typography variant="h5" className="subheading">Published Datapoints</Typography>
        <div>
          {publishedDatapoints.map((datapoint) => (
            <Card key={datapoint.id} className="card">
              <Typography>{datapoint.text}</Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: '#335058', alignSelf: 'flex-end' }}
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
              <IconButton
                className="close-icon"
                aria-label="Close"
                onClick={() => setSelectedDatapoint(null)}
              >
                <CloseIcon />
              </IconButton>
              <DataPoint
                title={selectedDatapoint.text}
                media={[{ EditIcon }, { DeleteIcon }]}
                address={selectedDatapoint.address}
                description={"desc"}
              />
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default ManageTask;










/*import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const ManageTask = () => {

  return (
    <section className="manage-task" id="manage-task">
      <p className="manage-h1">Manage Task</p>
      <br></br>
      <p className="manage-h2">Pending Datapoints</p>
      <br></br>
      <p className="manage-h2">Published Datapoints</p>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Dessert (100g serving)</StyledTableCell>
              <StyledTableCell align="right">Calories</StyledTableCell>
              <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
              <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
              <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.calories}</StyledTableCell>
                <StyledTableCell align="right">{row.fat}</StyledTableCell>
                <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                <StyledTableCell align="right">{row.protein}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </section>
  )

}
export default ManageTask*/


