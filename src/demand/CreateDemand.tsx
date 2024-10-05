import React, { useState } from 'react';
import { Button, Box, Typography, Container, CssBaseline, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
    }

const CreateDemand: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // Função para lidar com o upload dos arquivos
    const handleDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    // Função para enviar a demanda
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null); // Limpa mensagens de erro
        setSuccessMessage(null); // Limpa mensagens de sucesso

        if (files.length === 0) {
            setErrorMessage("Por favor, anexe ao menos um documento.");
            return;
        }

        try {
            // Obtendo o token do localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token de autenticação não encontrado.');
                return;
            }

            const decoded: DecodedToken = jwtDecode(token);
            const clientID = decoded.id; // Simular a obtenção do ID do cliente do token
            const timestamp = dayjs().format('YYYYMMDD_HHmmss');
            const folderName = `${clientID}_${timestamp}`;
            const filePaths = files.map(file => `${folderName}/${file.name}`);

            const formData = new FormData();
            files.forEach(file => formData.append('documents', file));
            
            // Enviando dados da demanda para a API
            const response = await fetch('http://localhost:3333/create/demand', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adiciona o token no header
                },
                body: JSON.stringify({
                    aplicant: clientID, // ID do cliente retirado do token
                    status: "demand_created",
                    file_paths: folderName,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Demanda criada com sucesso.');
                navigate('/'); // Redireciona para a home
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Erro ao criar demanda');
            }
        } catch (error) {
            setErrorMessage('Erro de rede ou servidor fora do ar: ' + error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Criação de Demanda
                    </Typography>

                    {errorMessage && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                            {successMessage}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #aaa',
                                padding: '20px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <input {...getInputProps()} />
                            <Typography>Arraste e solte seus arquivos aqui, ou clique para selecionar</Typography>
                            {files.length > 0 && (
                                <Typography sx={{ mt: 2 }}>
                                    {files.map(file => file.name).join(', ')}
                                </Typography>
                            )}
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Criar Demanda
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateDemand;
