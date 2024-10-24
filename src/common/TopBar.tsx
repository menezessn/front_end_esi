import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Atualizado para uso correto do jwtDecode

const pages = [
{ name: "Home", path: "/" },
{ name: "Nova demanda", path: "/create" },
];

const settings = ["Conta", "Sair"];

interface DecodedToken {
name: string;
userType: string;
iat: number;
exp: number;
}

function ResponsiveAppBar() {
const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

const navigate = useNavigate();

// Obter o nome e tipo de usuário do token
const token = localStorage.getItem("token");
let firstLetter = "U"; // Letra padrão caso não tenha token
let userType = ""; // Tipo de usuário

if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    firstLetter = decoded.name.charAt(0).toUpperCase(); // Primeira letra do nome
    userType = decoded.userType; // Tipo de usuário
}

const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
};

const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
};

const handleCloseNavMenu = () => {
    setAnchorElNav(null);
};

const handleCloseUserMenu = () => {
    setAnchorElUser(null);
};

const handleMenuClick = (setting: string) => {
    if (setting === "Sair") {
    localStorage.removeItem("token"); // Remove o token
    navigate("/login"); // Redireciona para a tela de login
    } else if (setting === "Conta") {
    navigate("/account"); // Redireciona para a tela de conta
    }
    handleCloseUserMenu();
};

return (
    <AppBar position="static" sx={{ backgroundColor: "#01A1C0" }}>
    <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Box
            component={Link}
            to="/"
            sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
                color: "#a69cad",
            },
            }}
        >
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                color: "#a69cad",
                },
            }}
            >
            SGD
            </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            >
            <MenuIcon />
            </IconButton>
            <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
                display: { xs: "block", md: "none" },
            }}
            >
            {pages.map((page) => (
                <MenuItem
                key={page.name}
                onClick={handleCloseNavMenu}
                component={Link}
                to={page.path}
                >
                <Typography
                    textAlign="center"
                    sx={{
                    color: "#000000",
                    }}
                >
                    {page.name}
                </Typography>
                </MenuItem>
            ))}
            {/* Adiciona a opção Cadastrar Usuários, visível apenas se o userType for diferente de aluno */}
            {userType !== "aluno" && (
                <MenuItem onClick={handleCloseNavMenu} component={Link} to="/register">
                <Typography textAlign="center" sx={{ color: "#000000" }}>
                    Cadastrar Usuários
                </Typography>
                </MenuItem>
            )}
            </Menu>
        </Box>

        <Box
            component={Link}
            to="/"
            sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
                color: "#a69cad",
            },
            flexGrow: { xs: 1, md: 0 },
            justifyContent: { xs: "center", md: "flex-start" },
            }}
        >
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                color: "#a69cad",
                },
            }}
            >
            SGD
            </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
            <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{
                my: 2,
                color: "white",
                display: "block",
                "&:hover": {
                    color: "#a69cad",
                },
                }}
                component={Link}
                to={page.path}
            >
                {page.name}
            </Button>
            ))}
            {/* Adiciona a opção Cadastrar Usuários, visível apenas se o userType for diferente de aluno */}
            {userType !== "aluno" && (
            <Button
                onClick={handleCloseNavMenu}
                sx={{
                my: 2,
                color: "white",
                display: "block",
                "&:hover": {
                    color: "#a69cad",
                },
                }}
                component={Link}
                to="/register"
            >
                Cadastrar Usuários
            </Button>
            )}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{firstLetter}</Avatar> {/* Exibe a primeira letra do nome do usuário */}
            </IconButton>
            </Tooltip>
            <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            >
            {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
            </Menu>
        </Box>
        </Toolbar>
    </Container>
    </AppBar>
);
}

export default ResponsiveAppBar;
