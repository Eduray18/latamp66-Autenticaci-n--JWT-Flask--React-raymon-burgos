import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardamos los datos para la sesión
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user_name", data.user.name); // Guardamos el nombre para el Navbar
                
                alert(`¡Bienvenido de nuevo, ${data.user.name}!`);
                navigate("/dashboard"); 
            } else {
                alert("Error: " + (data.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("Error de login:", error);
            alert("No se pudo conectar con el servidor de Gastos Hormiga.");
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#fff7ed" }}>
            <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-warning display-5">AntTracker</h2>
                    <p className="text-muted fw-semibold">Ingresa a tu panel de Gastos Hormiga</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-warning">CORREO ELECTRÓNICO</label>
                        <input type="email" className="form-control border-2 shadow-sm" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-warning">CONTRASEÑA</label>
                        <input type="password" className="form-control border-2 shadow-sm" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold shadow-sm text-white py-2" style={{ borderRadius: "10px" }}>
                        ENTRAR
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">¿Eres nuevo? </span>
                    <Link to="/signup" className="text-warning fw-bold text-decoration-none small">
                        Crea tu cuenta de AntTracker
                    </Link>
                </div>
            </div>
        </div>
    );
};