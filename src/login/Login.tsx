import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Paper, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
const [cpf, setCpf] = useState<string>(''); // Use CPF para o login
const [password, setPassword] = useState<string>('');
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const navigate = useNavigate();
const location = useLocation();

// Exibe mensagem de sucesso se o state for passado pela rota de registro
useEffect(() => {
    if (location.state?.newUser) {
    setSuccessMessage('Agora você pode logar.');
    }
}, [location.state]);

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Limpa erros anteriores
    setSuccessMessage(null); // Limpa mensagem de sucesso anterior

    try {
    const response = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, password }),
    });

    if (!response.ok) {
        throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Salva o token no localStorage
    navigate('/home'); // Redireciona para a rota home após o login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
    setError(error.message);
    }
};

return (
    <Container
    component="main"
    maxWidth={false}
    sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    }}
    >
    <CssBaseline />
    <Paper elevation={6} sx={{ padding: 4, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
            Login
        </Typography>

        {/* Exibe mensagem de sucesso se houver */}
        {successMessage && (
            <Alert severity="success" sx={{ width: '100%', marginBottom: 2 }}>
            {successMessage}
            </Alert>
        )}

        {/* Exibe mensagem de erro se houver */}
        {error && (
            <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
            {error}
            </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
            margin="normal"
            required
            fullWidth
            id="cpf"
            label="CPF"
            name="cpf"
            autoComplete="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            autoFocus
            />
            <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Entrar
            </Button>
            <Typography variant="body2" sx={{ fontSize: '1.0rem' }}>
            Ainda não tem uma conta?{' '}
            <Link component={RouterLink} to="/register">
                Registre-se
            </Link>
            </Typography>
        </Box>
        </Box>
    </Paper>
    </Container>
);
};

export default Login;
