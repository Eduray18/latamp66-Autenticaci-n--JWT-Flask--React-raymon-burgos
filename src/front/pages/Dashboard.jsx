import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [totalToday, setTotalToday] = useState(0);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchTodaySpent();
    }, [token]);

    const fetchTodaySpent = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/expenses/today`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTotalToday(data.total_today);
            }
        } catch (error) { console.error(error); }
    };

    const addQuickExpense = async (item, amount) => {
        try {
            const response = await fetch(`${backendUrl}/api/expense`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ item, amount })
            });
            if (response.ok) {
                alert(`${item} registrado.`);
                fetchTodaySpent(); // Recargamos el total
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="container mt-5">
            <div className="row text-center">
                <div className="col-12 card p-5 shadow-sm bg-white" style={{ borderRadius: "20px" }}>
                    <h1 className="display-4 fw-bold text-warning">Gastos Hormiga de Hoy</h1>
                    <p className="display-1 fw-bolder text-dark">${totalToday.toFixed(2)}</p>
                </div>
            </div>

            <div className="row mt-5 text-center">
                <h3 className="text-muted mb-4">Registro Rápido</h3>
                <div className="col-md-4 mb-3">
                    <button onClick={() => addQuickExpense("Café OXXO", 22.50)} className="btn btn-outline-warning btn-lg w-100 py-3 fw-bold">☕ Café ($22.50)</button>
                </div>
                <div className="col-md-4 mb-3">
                    <button onClick={() => addQuickExpense("Snack/Galletas", 35.00)} className="btn btn-outline-warning btn-lg w-100 py-3 fw-bold">🍪 Snack ($35.00)</button>
                </div>
                <div className="col-md-4 mb-3">
                    <button onClick={() => addQuickExpense("Transporte Corto", 60.00)} className="btn btn-outline-warning btn-lg w-100 py-3 fw-bold">🚕 Uber ($60.00)</button>
                </div>
            </div>
        </div>
    );
};