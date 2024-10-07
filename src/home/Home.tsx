import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, Container, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Demand {
    id: number;
    status: string;
    responsible_opinion: string | null;
    file_paths: string;
    aplicant: string | null;
}

const Home: React.FC = () => {
    const [demands, setDemands] = useState<Demand[]>([]);
    const token = localStorage.getItem('token'); // Pega o token armazenado para autenticação
    const navigate = useNavigate();

    // Função para buscar as demandas
    const fetchDemands = async () => {
        try {
            const response = await fetch('http://localhost:3333/demands', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adiciona o token no header
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDemands(data); // Armazena a lista de demandas no estado
            } else {
                console.error('Falha ao buscar demandas');
            }
        } catch (error) {
            console.error('Erro ao buscar demandas:', error);
        }
    };

    // Chama o fetchDemands ao carregar o componente
    useEffect(() => {
        fetchDemands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Função chamada ao clicar em uma demanda
    const handleDemandClick = (demand: Demand) => {
        navigate('/update', { state: { demand } });
    };

    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden', // Evita overflow na tela inteira
            }}
        >
            
            <Paper elevation={6} sx={{ padding: 4, width: '100%', maxWidth: 800, height: '80%', backgroundColor: '#f5f5f5' }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Lista de Demandas
                </Typography>
                <Box
                    sx={{
                        height: '95%',
                        overflowY: 'auto', // Permite scroll dentro da lista
                        backgroundColor: '#f5f5f5', // Mantém o fundo consistente
                        paddingRight: '1rem',
                    }}
                >
                    {demands.length === 0 ? (
                        // Exibe mensagem caso não haja demandas
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#a9a9a9', // Cinza mais claro
                                textAlign: 'center',
                                padding: '1rem',
                            }}
                        >
                            Não há demandas.
                        </Typography>
                    ) : (
                        // Exibe a lista de demandas
                        <List>
                            {demands.map((demand) => (
                                <ListItem key={demand.id} disablePadding>
                                    <ListItemButton onClick={() => handleDemandClick(demand)}>
                                        <ListItemText primary={`Demanda Nº: ${demand.id}`} secondary={`Status: ${demand.status}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Home;
