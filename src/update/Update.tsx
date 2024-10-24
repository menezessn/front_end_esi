import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline, Paper, MenuItem } from '@mui/material';

const UpdateDemand: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { demand } = location.state || { demand: null };

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
    const isStudent = user?.userType === 'aluno'; // Verifica se o usuário é aluno
    const isNotCoordinator = !(user?.userType === 'coordenador'); 
    const isNotCoordinatorOrSecretary = !(user?.userType === 'coordenador' || user?.userType === 'secretaria'); 


    const [responsibleOpinion, setResponsibleOpinion] = useState<string>(demand?.responsible_opinion || '');
    const [status, setStatus] = useState<string>(demand?.status || '');
    const [reviewer, setReviewer] = useState<string>(demand?.reviewer || '');
    const [files, setFiles] = useState<FileList | null>(null);

    const handleDownload = async () => {
        const response = await fetch(`http://localhost:3333/download?file_paths=${demand.file_paths}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'arquivos.zip'; // Nome do arquivo baixado
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Erro ao baixar os arquivos');
        }
    };

    const handleFileUpload = async () => {
        if (!files) return;

        const formData = new FormData();
        formData.append('file_paths', demand.file_paths);

        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        const response = await fetch(`http://localhost:3333/update/files`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Arquivos atualizados com sucesso!');
        } else {
            console.error('Erro ao atualizar os arquivos');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {
            id: demand.id,
        };

        if (responsibleOpinion) {
            body.responsible_opinion = responsibleOpinion;
        }
        if (status) {
            body.status = status;
        }
        if (reviewer) {
            body.reviewer = reviewer;
        }

        body.aplicant = demand.aplicant

        const response = await fetch(`http://localhost:3333/update/demand`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log('Demanda atualizada com sucesso!');
            navigate('/');
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
                            label="Responsável pelo parecer"
                            value={responsibleOpinion}
                            onChange={(e) => setResponsibleOpinion(e.target.value)}
                            disabled={isNotCoordinator} // Bloqueia o campo se o usuário for aluno
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Revisor do parecer"
                            value={reviewer}
                            onChange={(e) => setReviewer(e.target.value)}
                            disabled={isNotCoordinatorOrSecretary} // Bloqueia o campo se o usuário for aluno
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={isStudent}
                        >
                            <MenuItem value="Criada">Criada</MenuItem>
                            <MenuItem value="Parecer solicitado">Parecer solicitado</MenuItem>
                            <MenuItem value="Revisão solicitada">Revisão de parecer solicitado</MenuItem>
                            <MenuItem value="Pronto para a deliberação">Pronto para deliberação</MenuItem>
                            <MenuItem value="Deliberado">Deliberado</MenuItem>
                            <MenuItem value="Cancelado">Cancelado</MenuItem>
                        </TextField>

                        {/* Botão para download */}
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleDownload}
                        >
                            Baixar Arquivos
                        </Button>

                        {/* Seletor de arquivos e botão de envio visíveis apenas se o usuário não for aluno */}
                        {!isStudent && (
                            <>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                    style={{ marginTop: '20px' }}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleFileUpload}
                                >
                                    Enviar Arquivos
                                </Button>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Atualizar
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default UpdateDemand;
