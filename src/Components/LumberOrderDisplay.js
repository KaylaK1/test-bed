import {Box, Typography, Button, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {DataGridPremium, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid-premium";
import { gridClasses } from '@mui/x-data-grid';
import {useMemo, useState, memo} from "react";
import { updateLumberOrder } from '../Database/FirestoreQueries';


function AdditionalLumberOrderDisplay(props) {
  const [selectedLumberId, setSelectedLumberId] = useState('');
  const lumberOptions = useMemo(() => [
    { id: '1', type: "2x12 PT Brown", length: 168, count: 0 },
    { id: '2', type: "2x12 PT Brown", length: 144, count: 0 },
    { id: '3', type: "2x24 PT Brown", length: 120, count: 0 }
  ], []);

  const selectedLumber = useMemo(() => 
    lumberOptions.find(option => option.id === selectedLumberId),
    [lumberOptions, selectedLumberId], selectedLumberId
  );

  const handleChange = (event) => {
    setSelectedLumberId(event.target.value)
  };
  const handleClick = () => {
    if (selectedLumber) {
      updateLumberOrder(props.orderId, selectedLumber);
    }
  };

    const rows = useMemo(()=> {
        if (props.additionalLumberOrder) {
            let result = [];
            let idCounter = 1;  // Initialize the counter
            for (let material in props.additionalLumberOrder) {
                let materialObject = props.additionalLumberOrder[material];

                // For each material, loop over its dimensions
                for (let dimension in materialObject) {
                    let count = materialObject[dimension];

                    // Push each material, dimension, and count as an object into the results array
                    result.push({
                        id: idCounter,  // Assign the current counter value as id
                        material: material,
                        dimension: dimension,
                        count: count
                    });

                    idCounter++;  // Increment the counter
                }
            }

            return result
        } else {
            return []
        }

    }, [props.additionalLumberOrder])

    const [sortModel, setSortModel] = useState([
        {
            field: "material",
            sort: "asc",
        },
        {
            field: "dimension",
            sort: "asc",
        },
    ])


    const columns = [
        { field: 'material', headerName: 'Material', width: 125, editable: false, type: "string"},
        { field: 'dimension', headerName: 'Dimension', width: 125, editable: false, type: "string" },
        { field: 'count', headerName: 'Count', width: 100, editable: false, type: "number" },
    ];

    function EditToolbar() {
        return (
            <GridToolbarContainer className={gridClasses.toolbarContainer}>
                <Box
                    sx={{
                        display: "none",
                        displayPrint: "block",
                        textAlign: "center",
                        width: "100%",
                        pt: 2,
                        pb: 1,
                        pl: 1,
                    }}
                >
                    {props.clientName} || {props.workOrder} || {props.address} || {props.dueDate} || {props.modelName}
                </Box>
                <Box sx={{displayPrint: "none"}}>
                    <GridToolbarExport/>
                </Box>
            </GridToolbarContainer>
        );
    }


    return (
        <Box>
            <Typography variant="h4" gutterBottom component="div" mt={2} textAlign="center">
                Additional Lumber Order
            </Typography>
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
            <Box sx={{ width: "800px", mx: "auto", my: "25px"}}>
                <DataGridPremium
                    autoHeight
                    editMode="row"
                    rows={rows}
                    columns={columns}
                    density={"compact"}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    components={{
                        Toolbar: EditToolbar,
                    }}
                />
            </Box>

        </Box>
    )
};

export default memo(AdditionalLumberOrderDisplay, (prevProps, nextProps) => {
  // Return true if the component should NOT re-render
  return prevProps.additionalLumberOrder === nextProps.additionalLumberOrder;
});