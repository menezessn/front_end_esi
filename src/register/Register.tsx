import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Paper, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // React Router para redirecionamento

const Register: React.FC = () => {
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmSenha, setConfirmSenha] = useState<string>(''); // Para confirmar a senha
    const [nome, setNome] = useState<string>('');
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente'); // Exemplo de valor padrão
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Para exibir erros
    const navigate = useNavigate(); // Hook para navegação

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null); // Limpa a mensagem de erro antes do novo envio

        if (senha !== confirmSenha) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nome,
                    cpf: cpf,
                    email: email,
                    password: senha,
                    user_type: tipoUsuario,
                }),
            });

            if (response.ok) {
                // Se o cadastro for bem-sucedido, redireciona para a tela de login com um parâmetro
                navigate('/login', { state: { newUser: true } });
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Erro ao realizar cadastro');
            }
        } catch (error) {
            setErrorMessage('Erro de rede ou servidor fora do ar: ' + error);
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Cadastro de Usuário
                    </Typography>

                    {/* Exibe mensagem de erro, se houver */}
                    {errorMessage && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nome"
                            label="Nome"
                            name="nome"
                            autoComplete="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
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
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="senha"
                            label="Senha"
                            type="password"
                            id="senha"
                            autoComplete="new-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmSenha"
                            label="Confirmar Senha"
                            type="password"
                            id="confirm-senha"
                            value={confirmSenha}
                            onChange={(e) => setConfirmSenha(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            label="Tipo de Usuário"
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)}
                        >
                            <MenuItem value="aluno">Aluno</MenuItem>
                            <MenuItem value="funcionario">Docente/Funcionário</MenuItem>
                            <MenuItem value="secretaria">Secretária</MenuItem>
                            <MenuItem value="coordenador">Coordenador do programa</MenuItem>
                            <MenuItem value="membro_comissao">Membro da comissão</MenuItem>
                        </TextField>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Cadastrar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
