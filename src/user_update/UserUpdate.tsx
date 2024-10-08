import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline, Paper, MenuItem } from '@mui/material';

const UserUpdate: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Função para extrair as informações do token
    const parseToken = (token: string | null) => {
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do JWT
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            return null;
        }
    };

    const user = parseToken(token);
    
    const [name, setName] = useState<string>(user?.name || '');
    const [cpf, setCpf] = useState<string>(user?.cpf || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [userType, setUserType] = useState<string>(user?.userType || '');
    const [password, setPassword] = useState<string>(''); // Campo de senha vazio, só será enviado se for alterado

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redireciona para login se o usuário não estiver autenticado
        }
    }, [token, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {
            id: user?.id,
            name,
            cpf,
            email,
            user_type: userType
        };

        // Apenas adiciona a senha ao body se o campo não estiver vazio
        if (password) {
            body.password = password;
        }

        const response = await fetch(`http://localhost:3333/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            // Remove o token e redireciona para a tela de login após a atualização
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            console.error('Erro ao atualizar o usuário');
        }
    };

    return (
        <Container component="main" maxWidth={false} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <CssBaseline />
            <Paper elevation={6} sx={{ padding: 4, maxWidth: 600 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">Atualizar Usuário</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="CPF"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {userType !== 'aluno' && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                select
                                label="Tipo de Usuário"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <MenuItem value="funcionario">Docente/Funcionário</MenuItem>
                                <MenuItem value="secretaria">Secretária</MenuItem>
                                <MenuItem value="coordenador">Coordenador do programa</MenuItem>
                                <MenuItem value="membro_comissao">Membro da comissão</MenuItem>
                            </TextField>
                        )}
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Atualizar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserUpdate;
