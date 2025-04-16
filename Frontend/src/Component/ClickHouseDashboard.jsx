import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Paper,
    Checkbox,
    FormGroup,
    CircularProgress,
    Button,
    FormControlLabel,
    RadioGroup,
    Radio,
} from '@mui/material';
import axios from 'axios';

const ClickHouseDashboard = () => {
    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const filePath = 'C:/Users/HP/Desktop/exportCSV/export.csv';

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token is missing. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/clickhouse/tables', {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setTables(response.data); // Assuming backend returns an array of tables
            } catch (error) {
                setError('Failed to fetch tables. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const fetchColumns = async (tableName) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token is missing. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/clickhouse/columns?table=${tableName}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setColumns(response.data); // Assuming backend returns an array of columns
        } catch (error) {
            setError('Failed to fetch columns. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = (event) => {
        const tableName = event.target.value;
        setSelectedTable(tableName);
        fetchColumns(tableName);
        setSelectedColumns([]);
    };

    const handleColumnSelect = (event) => {
        const {name, checked} = event.target;
        setSelectedColumns((prev) =>
            checked ? [...prev, name] : prev.filter((col) => col !== name)
        );
    };

    const handleExport = async () => {
        if (!selectedTable) {
            setError('Please select a table.');
            return;
        }

        if (selectedColumns.length === 0) {
            setError('Please select at least one column.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token is missing. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:8080/api/clickhouse/export',
                selectedColumns, // Pass selected columns in the request body
                {
                    params: {
                        table: selectedTable,
                        filePath: filePath, // Adjust file path as needed
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                alert('Data export completed successfully. File saved in the selected folder.');
            } else {
                setError(`Data export failed. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Export error:', error);
            setError(
                error.response?.data || 'Data export failed. Please check the backend logs for more details.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '80%',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    ClickHouse Dashboard
                </Typography>

                {loading && <CircularProgress sx={{marginTop: 4}}/>}

                {error && <Typography color="error" sx={{marginTop: 2}}>{error}</Typography>}

                {tables.length > 0 && !loading && (
                    <Box sx={{marginTop: 4}}>
                        <Typography variant="h6">Available Tables</Typography>
                        <RadioGroup value={selectedTable} onChange={handleTableSelect}>
                            {tables.map((table) => (
                                <FormControlLabel
                                    key={table}
                                    control={<Radio/>}
                                    label={table}
                                    value={table}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                )}

                {columns.length > 0 && !loading && (
                    <Box sx={{marginTop: 4}}>
                        <Typography variant="h6">Available Columns</Typography>
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
                    </Box>
                )}

                {selectedTable && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{marginTop: 2}}
                        onClick={handleExport}
                    >
                        Export to CSV
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default ClickHouseDashboard;







