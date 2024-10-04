import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Paper, CssBaseline, Container, ListItemButton } from '@mui/material';
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
const token = localStorage.getItem('token'); // Pega o token armazenado para autenticação
// Dentro do seu componente Home
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
    setSelectedDemand(demand);
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
        <CssBaseline />
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
                <List>
                    {demands.map((demand) => (
                        <ListItem key={demand.id} disablePadding>
                            <ListItemButton onClick={() => handleDemandClick(demand)}>
                                <ListItemText primary={`Demanda ID: ${demand.id}`} secondary={`Status: ${demand.status}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Paper>
    </Container>
);
};

export default Home;
