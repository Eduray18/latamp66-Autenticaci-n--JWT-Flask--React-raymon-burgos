import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");

    // Si no hay token, lo mandamos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, dejamos que vea la página (children)
    return children;
};