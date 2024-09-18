import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useMemo } from 'react';
// additionalLumberOrder is the current additionalLumberOrder
// if you set setAdditionalLumberOrder to whatever you want it will be updated when the order is saved.


export const AdditionalLumberOrderDisplay = ({ additionalLumberOrder,
  setAdditionalLumberOrder,
  updateWorkOrderFirebase }) => {
    const [selectedLumberId, setSelectedLumberId] = useState(1);

    const lumberOptions = useMemo(() => [
      { id: '1', type: "2x12 PT Brown", length: 168 },
      { id: '2', type: "2x12 PT Brown", length: 144 },
      { id: '3', type: "2x12 PT Brown", length: 120 }
    ], []);
    
    const selectedLumber = useMemo(() => 
      lumberOptions.find(option => option.id === selectedLumberId),
      [lumberOptions, selectedLumberId]
    );
  
    const handleChange = (event) => {
      setSelectedLumberId(event.target.value);
    };
    const handleClick = () => {
      if (selectedLumber) {
        setAdditionalLumberOrder({ [selectedLumber.type]: selectedLumber.length });
      }
    };
  return (
    <Box sx={{ minWidth: 120 }}>
      Additional Lumber Order
      <FormControl fullWidth>
        <InputLabel id="lumber-select-label">Lumber</InputLabel>
        <Select
          labelId="lumber-select-label"
          id="lumber-select"
          value={selectedLumberId}
          label="Lumber"
          onChange={handleChange}
        >
          {lumberOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {`${option.type} ${option.length}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button 
        variant='contained'
        onClick={handleClick}
        disabled={!selectedLumberId}
      >
        Add to Order
      </Button>
    </Box>
)}
