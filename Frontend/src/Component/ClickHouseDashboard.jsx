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

//colourful ui
// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Typography,
//     Paper,
//     Checkbox,
//     FormGroup,
//     CircularProgress,
//     Button,
//     TextField,
//     FormControlLabel,
//     RadioGroup,
//     Radio,
// } from '@mui/material';
// import axios from 'axios';
//
// const ClickHouseDashboard = () => {
//     const [tables, setTables] = useState([]);
//     const [columns, setColumns] = useState([]);
//     const [selectedColumns, setSelectedColumns] = useState([]);
//     const [selectedTable, setSelectedTable] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [showInputFields, setShowInputFields] = useState(false);
//     const [inputValues, setInputValues] = useState({});
//
//     useEffect(() => {
//         const fetchTables = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     setError('Authentication token is missing. Please log in.');
//                     setLoading(false);
//                     return;
//                 }
//
//                 const response = await axios.get('http://localhost:8080/api/clickhouse/tables', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setTables(response.data); // Assuming backend returns an array of tables
//             } catch (error) {
//                 setError('Failed to fetch tables. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchTables();
//     }, []);
//
//     const fetchColumns = async (tableName) => {
//         setLoading(true);
//         setError('');
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Authentication token is missing. Please log in.');
//                 setLoading(false);
//                 return;
//             }
//
//             const response = await axios.get(`http://localhost:8080/api/clickhouse/columns?table=${tableName}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setColumns(response.data); // Assuming backend returns an array of columns
//         } catch (error) {
//             setError('Failed to fetch columns. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleTableSelect = (event) => {
//         const tableName = event.target.value;
//         setSelectedTable(tableName);
//         fetchColumns(tableName);
//         setShowInputFields(false);
//         setInputValues({});
//     };
//
//     const handleColumnSelect = (event) => {
//         const { name, checked } = event.target;
//         setSelectedColumns((prev) =>
//             checked ? [...prev, name] : prev.filter((col) => col !== name)
//         );
//     };
//
//     const handleInsertClick = () => {
//         setShowInputFields(true);
//     };
//
//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//
//         // Format 'dob' column as 'yyyy-MM-dd HH:mm:ss' if it's a DateTime
//         const formattedValue = name === 'dob'
//             ? new Date(value).toISOString().replace('T', ' ').split('.')[0]
//             : value;
//
//         setInputValues((prev) => ({ ...prev, [name]: formattedValue }));
//     };
//
//     const handleSubmit = async () => {
//         if (!selectedTable || selectedColumns.length === 0) {
//             setError('Please select a table and at least one column.');
//             return;
//         }
//
//         // Validate that all selected columns have values
//         const missingValues = selectedColumns.filter((col) => !inputValues[col]);
//         if (missingValues.length > 0) {
//             setError(`Please provide values for: ${missingValues.join(', ')}`);
//             return;
//         }
//
//         setLoading(true);
//         setError('');
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Authentication token is missing. Please log in.');
//                 setLoading(false);
//                 return;
//             }
//
//             // Transform inputValues into the required format (array of objects)
//             const payload = [
//                 selectedColumns.reduce((row, column) => {
//                     row[column] = inputValues[column];
//                     return row;
//                 }, {})
//             ];
//
//             const response = await axios.post(
//                 `http://localhost:8080/api/clickhouse/ingest?table=${selectedTable}`,
//                 payload,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//
//             if (response.status === 200) {
//                 alert('Data inserted successfully!');
//                 setShowInputFields(false);
//                 setInputValues({});
//             } else {
//                 setError('Data insertion failed. Please try again.');
//             }
//         } catch (error) {
//             setError('Data insertion failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
//             <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
//                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">ClickHouse ClickHouseDashboard</h1>
//
//                 {loading && <div className="flex justify-center my-4"><CircularProgress /></div>}
//
//                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//
//                 {tables.length > 0 && !loading && (
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Tables</h2>
//                         <RadioGroup value={selectedTable} onChange={handleTableSelect} className="space-y-2">
//                             {tables.map((table) => (
//                                 <FormControlLabel
//                                     key={table}
//                                     control={<Radio />}
//                                     label={table}
//                                     value={table}
//                                     className="text-gray-600"
//                                 />
//                             ))}
//                         </RadioGroup>
//                     </div>
//                 )}
//
//                 {columns.length > 0 && !loading && (
//                     <div className="mb-6">
//                         <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Columns</h2>
//                         <FormGroup>
//                             {columns.map((column) => (
//                                 <FormControlLabel
//                                     key={column}
//                                     control={
//                                         <Checkbox
//                                             name={column}
//                                             onChange={handleColumnSelect}
//                                             checked={selectedColumns.includes(column)}
//                                             className="text-blue-500"
//                                         />
//                                     }
//                                     label={column}
//                                     className="text-gray-600"
//                                 />
//                             ))}
//                         </FormGroup>
//                     </div>
//                 )}
//
//                 {selectedColumns.length > 0 && (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                         onClick={handleInsertClick}
//                     >
//                         Insert Values
//                     </Button>
//                 )}
//
//                 {showInputFields && (
//                     <div className="mt-6">
//                         <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Values</h2>
//                         {selectedColumns.map((column) => (
//                             <TextField
//                                 key={column}
//                                 label={column}
//                                 name={column}
//                                 value={inputValues[column] || ''}
//                                 onChange={handleInputChange}
//                                 fullWidth
//                                 margin="normal"
//                                 className="mb-4"
//                             />
//                         ))}
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//                             onClick={handleSubmit}
//                         >
//                             Submit
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default ClickHouseDashboard;






