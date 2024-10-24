import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface PrivelegedRouteProps {
    children: React.ReactNode;
}

interface DecodedToken {
    id: string;
    email: string;
    userType:string;
    }

const PrivelegedRoute: React.FC<PrivelegedRouteProps> = ({ children }) => {
const token = localStorage.getItem('token'); // Pega o token do localStorage

// Se não houver token, redireciona para login
if (!token) {
    return <Navigate to="/login" />;
}

const decoded: DecodedToken = jwtDecode(token);
const userType = decoded.userType; 
console.log(userType)
if (userType == "aluno") {
    return <Navigate to="/" />;
}

return <>{children}</>;
};

export default PrivelegedRoute;
