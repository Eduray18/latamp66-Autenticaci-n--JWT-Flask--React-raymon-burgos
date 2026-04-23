import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert("¡Cuenta de AntTracker creada! Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                const errorData = await response.json();
                alert("Error al registrar: " + (errorData.msg || "Verifica los datos"));
            }
        } catch (error) {
            console.error("Error en signup:", error);
            alert("Error de conexión con el servidor de Gastos Hormiga.");
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#fff7ed" }}>
            <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-warning display-5">AntTracker</h2>
                    <p className="text-muted fw-semibold">Regístrate y controla tus Gastos Hormiga</p>
                </div>
                
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-warning">NOMBRE COMPLETO</label>
                        <input type="text" className="form-control border-2 shadow-sm" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-warning">CORREO ELECTRÓNICO</label>
                        <input type="email" className="form-control border-2 shadow-sm" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-warning">CONTRASEÑA</label>
                        <input type="password" className="form-control border-2 shadow-sm" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    
                    <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold shadow-sm text-white py-2" style={{ borderRadius: "10px" }}>
                        CREAR CUENTA
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-muted small">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="text-warning fw-bold text-decoration-none small">
                        Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};