import React, {useState} from 'react';
import {Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const SourceSelection = () => {
    const [source, setSource] = useState('');
    const navigate = useNavigate();

    const handleSourceChange = (event) => {
        setSource(event.target.value);
    };

    const handleNext = () => {
        if (source === "ClickHouse") {
            navigate('/connection-form'); // Navigate to ConnectionForm
        } else if (source === "Flat File") {
            navigate('/flat-file');
        } else {
            alert('Please select a source to proceed.');
        }
    };

    return (
        <Box className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <Box className="p-8 bg-white shadow-md rounded-md w-full max-w-lg">
                <Typography variant="h4" className="mb-6 text-center">
                    Select Data Source
                </Typography>
                <FormControl component="fieldset" className="w-full">
                    <RadioGroup value={source} onChange={handleSourceChange}>
                        <FormControlLabel value="ClickHouse" control={<Radio/>} label="ClickHouse"/>
                        <FormControlLabel value="Flat File" control={<Radio/>} label="Flat File"/>
                    </RadioGroup>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    className="mt-6 w-full"
                    onClick={handleNext}
                >
                    {source === "ClickHouse"
                        ? "Connect to Database"
                        : source === "Flat File"
                            ? "Upload Flat File"
                            : "Select Data Source"}
                </Button>
            </Box>
        </Box>
    );
};

export default SourceSelection;