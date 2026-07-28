import React, { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Tareas from "./components/Tareas";
import Pomodoro from "./components/Pomodoro";
import Estadisticas from "./components/Estadisticas";
import Configuracion from "./components/Configuracion";

const VISTAS = {
  dashboard: Dashboard,
  tareas: Tareas,
  pomodoro: Pomodoro,
  estadisticas: Estadisticas,
  configuracion: Configuracion,
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const VistaActiva = VISTAS[activeTab] ?? Dashboard;

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Navbar activeTab={activeTab} user={user} onLogout={handleLogout} />

        <main className="flex-1 p-8">
          <VistaActiva user={user} />
        </main>
      </div>
    </div>
  );
}