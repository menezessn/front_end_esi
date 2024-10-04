import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
const token = localStorage.getItem('token'); // Pega o token do localStorage

// Se não houver token, redireciona para login
if (!token) {
    return <Navigate to="/login" />;
}

return <>{children}</>;
};

export default PrivateRoute;
