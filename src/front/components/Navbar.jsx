import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const userName = sessionStorage.getItem("user_name"); // Leemos el nombre guardado en Login

    const handleLogout = () => {
        sessionStorage.clear(); // Borra token y nombre
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-warning shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3" to="/">AntTracker 🐜</Link>
                
                <div className="d-flex align-items-center">
                    {token ? (
                        <>
                            {/* Mostramos el nombre del usuario logueado */}
                            <span className="text-white me-3 fw-bold">HOLA, {userName?.toUpperCase()}</span>
                            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Salir</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-outline-light btn-sm">Entrar</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};