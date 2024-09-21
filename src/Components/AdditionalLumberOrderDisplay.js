import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useMemo, useEffect, memo } from 'react';
import { updateLumberOrder } from '../Database/FirestoreQueries';
// additionalLumberOrder is the current additionalLumberOrder
// if you set setAdditionalLumberOrder to whatever you want it will be updated when the order is saved.

import { db } from '../Database/firestore';
import { onSnapshot, doc } from 'firebase/firestore';

const AdditionalLumberOrderDisplay = ({order}) => {
    const [selectedLumberId, setSelectedLumberId] = useState('');
    const [additionalLumberOrder, setAdditionalLumberOrder] = useState([]);
    const lumberOptions = useMemo(() => [
      { id: '1', type: "2x12 PT Brown", length: 168, count: 0 },
      { id: '2', type: "2x12 PT Brown", length: 144, count: 0 },
      { id: '3', type: "2x24 PT Brown", length: 120, count: 0 }
    ], []);

    useEffect(() => {
      if (!order) {
          return;
      }
      const unsubscribe = onSnapshot(doc(db, "work_orders", order), (doc) => {
        setAdditionalLumberOrder(doc.data().additionalLumberOrder)
      });
      console.log(additionalLumberOrder);
      return () => unsubscribe()
  }, [order])
    
    const selectedLumber = useMemo(() => 
      lumberOptions.find(option => option.id === selectedLumberId),
      [lumberOptions, selectedLumberId], selectedLumberId
    );

    const handleChange = (event) => {
      setSelectedLumberId(event.target.value)
    };
    const handleClick = () => {
      if (selectedLumber) {
        updateLumberOrder(order, selectedLumber);
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
      <div className="order-info">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Length</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
              {
                    Object.entries(additionalLumberOrder).map(([material, details]) => (
                      Object.entries(details).map(([length, count], i) => (
                        <tr key={`${material}-${length}-${i}`}>
                          <td>{material}</td>
                          <td>{length}</td>
                          <td>{count}</td>
                        </tr>
                      ))
                    ))}
    </tbody>
    </table>
    </div>
    </Box>
)}

const Display = (additionalLumberOrder) => {
  return (
  <>
    {
      Object.entries(additionalLumberOrder).forEach((material, i) => (
          <tr key={`${material.id}-${i}`}>
            <td>{material.type}</td>
            <td>{material.length}</td>
            <td>{material.count}</td>
          </tr>
        )
      )
    }

    </>
);}

export default memo(AdditionalLumberOrderDisplay, (prevProps, nextProps) => {
  return prevProps.additionalLumberOrder === nextProps.additionalLumberOrder;
})