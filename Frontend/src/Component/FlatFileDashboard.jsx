import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    FormControl,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import axios from 'axios';

const FlatFileDashboard = () => {
    const [file, setFile] = useState(null);
    const [delimiter, setDelimiter] = useState(',');
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [editableRows, setEditableRows] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleColumnSelect = (event) => {
        const {name, checked} = event.target;
        setSelectedColumns((prev) =>
            checked ? [...prev, name] : prev.filter((col) => col !== name)
        );
    };

    const handleLoadFile = async () => {
        if (!file) {
            setError('Please upload a file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('delimiter', delimiter);
        formData.append('table', 'table_name');
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:8080/api/flatfile/upload', formData, {
                headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`},
            });

            setSuccessMessage(response.data.message);
            setRows(response.data.rows);
            setColumns(Object.keys(response.data.rows[0] || {}));
        } catch (error) {
            setError('Failed to load file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRow = (index, column, value) => {
        const updatedRows = [...editableRows];
        updatedRows[index] = {...updatedRows[index], [column]: value};
        setEditableRows(updatedRows);
    };

    const handleSelectRows = () => {
        const filteredRows = rows.map((row) =>
            Object.fromEntries(
                Object.entries(row).filter(([key]) => selectedColumns.includes(key))
            )
        );
        setEditableRows(filteredRows);
    };

    const handleIngestData = async () => {
        if (editableRows.length === 0) {
            setError('No rows selected for ingestion.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(
                'http://localhost:8080/api/clickhouse/ingest',
                editableRows, // Send the rows array directly
                {
                    params: {
                        table: 'users', // Pass table name as a query parameter
                        batchSize: 1000, // Pass batch size as a query parameter
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            setSuccessMessage(response.data.message);
        } catch (error) {
            setError('Data ingestion failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            <Box className="p-8 bg-white shadow-md rounded-md w-full max-w-4xl">
                <Typography variant="h4" className="mb-6 text-center">
                    Flat File Dashboard
                </Typography>

                {error && <Typography color="error" className="mb-4">{error}</Typography>}
                {successMessage && <Typography color="primary" className="mb-4">{successMessage}</Typography>}

                <FormControl fullWidth className="mb-4">
                    <Typography variant="h6">Upload File</Typography>
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                    >
                        Choose File
                        <input type="file" hidden onChange={handleFileChange}/>
                    </Button>
                </FormControl>

                <FormControl fullWidth className="mb-4">
                    <Typography variant="h6">Enter Delimiter</Typography>
                    <TextField
                        value={delimiter}
                        onChange={(event) => setDelimiter(event.target.value)}
                        placeholder="Enter delimiter (e.g., , or ; or \t)"
                    />
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    className="mb-6"
                    onClick={handleLoadFile}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24}/> : 'Load File'}
                </Button>

                {columns.length > 0 && (
                    <Box className="mb-6">
                        <Typography variant="h6">Select Columns</Typography>
                        <FormGroup>
                            {columns.map((column) => (
                                <FormControlLabel
                                    key={column}
                                    control={
                                        <Checkbox
                                            name={column}
                                            onChange={handleColumnSelect}
                                            checked={selectedColumns.includes(column)}
                                        />
                                    }
                                    label={column}
                                />
                            ))}
                        </FormGroup>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSelectRows}
                        >
                            Select Rows
                        </Button>
                    </Box>
                )}

                {editableRows.length > 0 && (
                    <TableContainer component={Paper} className="mt-6">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(editableRows[0]).map((key) => (
                                        <TableCell key={key}>{key}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {editableRows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {Object.entries(row).map(([key, value]) => (
                                            <TableCell key={key}>
                                                <TextField
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleEditRow(rowIndex, key, e.target.value)
                                                    }
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {editableRows.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleIngestData}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : 'Ingest to ClickHouse'}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default FlatFileDashboard;