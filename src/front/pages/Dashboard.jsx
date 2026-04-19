import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();
    
    // Estado para capturar datos de salud
    const [stats, setStats] = useState({
        age: "",
        height: "",
        weight: "",
        dietType: "Equilibrada",
        caloriesRemaining: 1515
    });

    // Simulamos la recuperación del ID del usuario desde el almacenamiento local
    const [userId, setUserId] = useState(sessionStorage.getItem("user_id") || "Invitado");

    // Protección de la ruta: si no hay token, al login
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Función para el botón de GUARDAR
    const handleSave = async (e) => {
        e.preventDefault();
        
        // Estructura de los datos vinculados al usuario
        const dataToSave = {
            user_id: userId,
            ...stats
        };

        console.log("Enviando datos al backend para el usuario:", userId, dataToSave);
        
        // Por ahora, mostramos el éxito visualmente
        alert(`¡Datos guardados con éxito para el Usuario ID: ${userId}!\nEdad: ${stats.age}\nAltura: ${stats.height}\nDieta: ${stats.dietType}`);
    };

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: "#f0fdf4" }}>
            {/* Barra de Navegación Superior */}
            <header className="bg-success text-white p-3 shadow-sm">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="h3 mb-0 fw-bold">NutriFit</h1>
                    <div className="d-flex align-items-center gap-3">
                        <span className="small">ID Usuario: <span className="badge bg-light text-success">{userId}</span></span>
                        <button 
                            onClick={() => { sessionStorage.clear(); navigate("/login"); }} 
                            className="btn btn-sm btn-outline-light">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="container py-5">
                <div className="row g-4">
                    
                    {/* Panel Izquierdo: Formulario de Salud */}
                    <div className="col-lg-5 col-xl-4">
                        <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "20px" }}>
                            <h4 className="text-success fw-bold mb-4">Perfil de Salud</h4>
                            
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small">EDAD (AÑOS)</label>
                                    <input type="number" className="form-control form-control-lg border-2 shadow-sm" 
                                        placeholder="Ej: 33" 
                                        value={stats.age} 
                                        onChange={e => setStats({...stats, age: e.target.value})} 
                                        required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small">ALTURA (CM)</label>
                                    <input type="number" className="form-control form-control-lg border-2 shadow-sm" 
                                        placeholder="Ej: 175" 
                                        value={stats.height} 
                                        onChange={e => setStats({...stats, height: e.target.value})} 
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-muted small">TIPO DE DIETA</label>
                                    <select className="form-select form-select-lg border-2 shadow-sm" 
                                        value={stats.dietType} 
                                        onChange={e => setStats({...stats, dietType: e.target.value})}>
                                        <option value="Equilibrada">🥗 Equilibrada</option>
                                        <option value="Vegana">🌱 Vegana</option>
                                        <option value="Keto">🥩 Keto / Proteica</option>
                                        <option value="Baja en Azúcar">🍎 Baja en Azúcar</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow">
                                    💾 GUARDAR CAMBIOS
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Panel Derecho: Visualización de Progreso */}
                    <div className="col-lg-7 col-xl-8">
                        <div className="card border-0 shadow-lg p-5 text-center h-100" style={{ borderRadius: "20px", background: "white" }}>
                            <h5 className="text-muted fw-bold mb-4">RESUMEN DIARIO DE CALORÍAS</h5>
                            
                            <div className="d-flex justify-content-center align-items-center my-4">
                                <div className="rounded-circle d-flex flex-column justify-content-center align-items-center shadow" 
                                     style={{ 
                                         width: "250px", 
                                         height: "250px", 
                                         border: "12px solid #28a745",
                                         background: "#f8fff9" 
                                     }}>
                                    <span className="text-muted small fw-bold">RESTANTES</span>
                                    <h1 className="display-2 fw-bold text-success mb-0">{stats.caloriesRemaining}</h1>
                                    <span className="text-muted small">Kcal de 2300</span>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-6 offset-md-3">
                                    <div className="p-3 rounded-pill bg-light border border-success-subtle shadow-sm">
                                        <span className="text-success fw-bold">Plan Activo:</span> {stats.dietType}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 row g-3">
                                <div className="col-4">
                                    <div className="p-3 bg-light rounded shadow-sm">
                                        <span className="d-block small text-muted">EDAD</span>
                                        <span className="h5 fw-bold text-dark">{stats.age || "--"}</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 bg-light rounded shadow-sm">
                                        <span className="d-block small text-muted">ALTURA</span>
                                        <span className="h5 fw-bold text-dark">{stats.height ? `${stats.height}cm` : "--"}</span>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 bg-light rounded shadow-sm">
                                        <span className="d-block small text-muted">HIDRATACIÓN</span>
                                        <span className="h5 fw-bold text-primary">0.8 L</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};