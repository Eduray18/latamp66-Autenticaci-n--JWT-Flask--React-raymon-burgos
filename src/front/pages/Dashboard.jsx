import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();
    const [water, setWater] = useState(0);
    const [calories, setCalories] = useState(0);
    const [userId, setUserId] = useState(null);
    
    // Estado para los datos del perfil
    const [stats, setStats] = useState({
        age: "",
        height: "",
        weight: "",
        dietType: "Equilibrada"
    });

    const token = sessionStorage.getItem("token");
    const storedUserId = sessionStorage.getItem("user_id"); // Recuperamos el ID guardado en Login
    const BACKEND_URL = "https://solid-broccoli-97rj4r4r5p543rgg-3001.app.github.dev";

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        setUserId(storedUserId);

        const loadDashboardData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/daily-summary`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWater(data.total_water || 0);
                    setCalories(data.total_calories || 0);
                    
                    // Cargamos lo que ya está en la DB para que no se borre al recargar
                    setStats({
                        age: data.age || "",
                        height: data.height || "",
                        weight: data.weight || "",
                        dietType: data.diet_type || "Equilibrada"
                    });
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        loadDashboardData();
    }, [token, navigate, storedUserId]);

    const handleUpdateWeight = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/api/user-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: parseInt(stats.age),     // Mantiene la edad actual
                    height: parseFloat(stats.height), // Mantiene la altura actual
                    weight: parseFloat(stats.weight), // Envía el nuevo peso
                    diet_type: stats.dietType    // Mantiene la dieta seleccionada
                })
            });

            if (response.ok) {
                alert("✅ ¡Peso y perfil actualizados!");
            }
        } catch (error) {
            alert("Error de red");
        }
    };

    const addWater = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/daily-log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ category: "Agua", food: "Vaso", water: 250, calories: 0 })
            });
            if (response.ok) setWater(prev => prev + 250);
        } catch (error) { console.error("Error"); }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: "#f8fafc" }}>
            {/* BARRA SUPERIOR CON ID Y CERRAR SESIÓN */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm px-4 mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold">NutriFit 🍏</span>
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3 opacity-75 small">User ID: {userId || "..."}</span>
                        <button onClick={handleLogout} className="btn btn-sm btn-outline-light rounded-pill px-3">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container">
                {/* BANNER DE ESTADO ACTUAL */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 text-white" style={{ background: "linear-gradient(135deg, #198754 0%, #1ea362 100%)", borderRadius: "15px" }}>
                            <div className="card-body p-4 text-center">
                                <div className="row">
                                    <div className="col-md-3 border-end border-white border-opacity-25">
                                        <p className="small mb-0 opacity-75">PESO REGISTRADO</p>
                                        <h2 className="fw-bold">{stats.weight || "--"} <small className="fs-6">kg</small></h2>
                                    </div>
                                    <div className="col-md-3 border-end border-white border-opacity-25">
                                        <p className="small mb-0 opacity-75">DIETA</p>
                                        <h3 className="fw-bold">{stats.dietType}</h3>
                                    </div>
                                    <div className="col-md-3 border-end border-white border-opacity-25">
                                        <p className="small mb-0 opacity-75">ESTATURA</p>
                                        <h3 className="fw-bold">{stats.height} <small className="fs-6">cm</small></h3>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="small mb-0 opacity-75">EDAD</p>
                                        <h3 className="fw-bold">{stats.age} <small className="fs-6">años</small></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* COLUMNA DE ACTUALIZACIÓN DE PESO Y DATOS */}
                    <div className="col-md-4">
                        <div className="card shadow border-0 p-4" style={{ borderRadius: "15px" }}>
                            <h5 className="fw-bold mb-3 text-success">Control de Peso</h5>
                            <form onSubmit={handleUpdateWeight}>
                                <div className="mb-3">
                                    <label className="small fw-bold text-muted">PESO ACTUAL (KG)</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-lg border-success border-opacity-25" 
                                        value={stats.weight} 
                                        onChange={e => setStats({...stats, weight: e.target.value})} 
                                        placeholder="Ej: 75"
                                    />
                                    <div className="form-text small">Cambia este valor cada vez que te peses.</div>
                                </div>
                                <hr className="my-4 text-muted opacity-25" />
                                <h6 className="small fw-bold text-muted mb-3">OTROS DATOS</h6>
                                <div className="mb-2">
                                    <label className="small text-muted">Edad</label>
                                    <input type="number" className="form-control form-control-sm" value={stats.age} onChange={e => setStats({...stats, age: e.target.value})} />
                                </div>
                                <div className="mb-2">
                                    <label className="small text-muted">Estatura (cm)</label>
                                    <input type="number" className="form-control form-control-sm" value={stats.height} onChange={e => setStats({...stats, height: e.target.value})} />
                                </div>
                                <div className="mb-4">
                                    <label className="small text-muted">Tipo de Dieta</label>
                                    <select className="form-select form-select-sm" value={stats.dietType} onChange={e => setStats({...stats, dietType: e.target.value})}>
                                        <option value="Equilibrada">Equilibrada</option>
                                        <option value="Vegana">Vegana</option>
                                        <option value="Keto">Keto</option>
                                    </select>
                                </div>
                                <button className="btn btn-success w-100 fw-bold shadow-sm py-2">ACTUALIZAR DATOS</button>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DE PROGRESO DIARIO */}
                    <div className="col-md-8">
                        <div className="card shadow border-0 p-4 text-center h-100" style={{ borderRadius: "15px" }}>
                            <h5 className="text-muted fw-bold mb-4">Progreso de Hoy</h5>
                            <div className="row align-items-center h-75">
                                <div className="col-md-6 border-end">
                                    <div className="rounded-circle d-inline-flex flex-column justify-content-center align-items-center shadow-sm" 
                                         style={{ width: "160px", height: "160px", border: "10px solid #198754", backgroundColor: "#f0fff4" }}>
                                        <span className="small text-muted fw-bold">CALORÍAS</span>
                                        <h1 className="fw-bold text-success mb-0">{calories}</h1>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1 small fw-bold text-muted">HIDRATACIÓN</p>
                                    <h2 className="text-primary fw-bold">{(water/1000).toFixed(2)}L</h2>
                                    <button onClick={addWater} className="btn btn-primary btn-sm rounded-pill mt-3 px-4 shadow-sm">
                                        + 250ml de Agua
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};