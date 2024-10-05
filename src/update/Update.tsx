import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline, Paper } from '@mui/material';

const UpdateDemand: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { demand } = location.state || { demand: null }; // Obtém a demanda do estado

    const [responsibleOpinion, setResponsibleOpinion] = useState<string>(demand?.responsible_opinion || '');
    const [filePaths, setFilePaths] = useState<string>(demand?.file_paths || '');
    const [status, setStatus] = useState<string>(demand?.status || '');

    // Função chamada ao enviar o formulário
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

         // Criação do corpo da requisição
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = {
        id: demand.id,
    };

    if (responsibleOpinion) {
        body.responsible_opinion = responsibleOpinion;
    }
    if (filePaths) {
        body.file_paths = filePaths;
    }
    if (status) {
        body.status = status;
    }
        
        // Lógica para enviar os dados atualizados para a API
        const response = await fetch(`http://localhost:3333/update/demand`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Substitua por como você armazena o token
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log('Demanda atualizada com sucesso!');
            navigate('/'); // Redireciona para a tela inicial após atualização
        } else {
            console.error('Erro ao atualizar a demanda. ' + demand.id);
        }
    };

    return (
        <Container component="main" maxWidth={false} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <CssBaseline />
            <Paper elevation={6} sx={{ padding: 4, maxWidth: 600 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">Atualizar Demanda</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Responsável pela Opinião"
                            value={responsibleOpinion}
                            onChange={(e) => setResponsibleOpinion(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Caminho do Arquivo"
                            value={filePaths}
                            onChange={(e) => setFilePaths(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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

export default UpdateDemand;
