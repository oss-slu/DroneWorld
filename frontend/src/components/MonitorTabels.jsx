import React from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import Grid from '@mui/material/Grid';

export default function MonitorTabels(colData) {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: colData.windowHeight - 200,
    },
    tableRow: {
      border: '1px solid red',
      display: 'table-row',
    },
  });

  const columns = [
    { id: 1, label: 'Latitude', minWidth: 100 },
    { id: 2, label: 'Longitude', minWidth: 100 },
    { id: 3, label: 'Altitude', minWidth: 100 },
    { id: 4, label: 'Action', minWidth: 100 },
  ];
  const columnsWithoutAltitude = [
    { id: 1, label: 'Latitude', minWidth: 100 },
    { id: 2, label: 'Longitude', minWidth: 100 },
    { id: 4, label: 'Action', minWidth: 100 },
  ];

  const [rows, setRows] = React.useState([
    [0, 0, 0],
    // [1,1,1],
    // [1,1,1],
    // [1,1,1]
  ]);

  const classes = useStyles();
  const [style, setStyle] = React.useState({
    display: 'block',
    background: 'rgb(224 224 224)',
    width: '100%',
  });
  const addNewRow = () => {
    console.log('added new row');
    let newRows = [...rows];
    newRows.push([0, 0, 0]);
    setRows(newRows);
  };
  const removeRow = (index) => {
    console.log('in remove row', index);
    let newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (event, index, innerArrayIndex) => {
    setRows((objs) => {
      return objs.map((obj, i) => {
        if (index === i) {
          obj[innerArrayIndex] = parseFloat(event.target.value);
          obj = {
            ...obj,
          };
        }
        return obj;
      });
    });
  };
  React.useEffect(() => {
    colData.jsonVal(rows);
  }, [rows]);
  return (
    <Paper className={classes.root}>
      {colData.errorMessage == 'true' ? (
        <div style={{ padding: '5px', color: 'blue' }}>
          {rows.length < 4 ? (
            <Grid container direction='row'>
              <InfoIcon />
              &nbsp;Minimum 4 rows required
            </Grid>
          ) : null}
        </div>
      ) : null}
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {colData.hideAltitude == 'true'
                ? columnsWithoutAltitude.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))
                : columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    id='Latitude'
                    variant='standard'
                    type='number'
                    inputProps={{ step: '.0001' }}
                    value={row[0]}
                    onChange={(e) => handleChange(e, index, 0)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    id='Longitude'
                    variant='standard'
                    type='number'
                    inputProps={{ step: '.0001' }}
                    value={row[1]}
                    onChange={(e) => handleChange(e, index, 1)}
                  />
                </TableCell>
                {colData.hideAltitude == 'true' ? null : (
                  <TableCell>
                    <TextField
                      id='Altitude'
                      variant='standard'
                      type='number'
                      inputProps={{ step: '1' }}
                      value={row[2]}
                      onChange={(e) => handleChange(e, index, 2)}
                    />
                  </TableCell>
                )}
                <TableCell onClick={() => removeRow(index)}>
                  <DeleteForeverIcon />
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              onMouseEnter={(e) => {
                setStyle({ display: 'block', background: 'rgb(224 224 224)', width: '100%' });
              }}
              onMouseLeave={(e) => {
                setStyle({ display: 'block', background: 'rgb(224 224 224)', width: '100%' });
              }}
            >
              <TableCell component='th' scope='row' colSpan={4} onClick={addNewRow}>
                <AddIcon style={style} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
