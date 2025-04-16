import React, {useState} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const ConnectionForm = () => {
    const [formData, setFormData] = useState({
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/clickhouse/connect', formData);
            console.log('Response:', response.data);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('message', response.data.message);
                toast.success('Successfully connected to the server.');
                navigate('/dashboard'); // Redirect to the dashboard
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to connect to the server.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: 400,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    ClickHouse Connection
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Host"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Port"
                        name="port"
                        type="number"
                        value={formData.port}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Database"
                        name="database"
                        value={formData.database}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{marginTop: 2}}
                    >
                        Connect
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ConnectionForm;