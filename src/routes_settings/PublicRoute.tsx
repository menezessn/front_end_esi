import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
const token = localStorage.getItem('token'); // Verifica se há um token no localStorage

// Se o usuário já está logado (com token), redireciona para a home
if (token) {
    return <Navigate to="/home" />;
}

return <>{children}</>;
};

export default PublicRoute;
