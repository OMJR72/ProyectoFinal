import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./context/NotificationContext";

import Dashboard from "./components/Dashboard";
import Tareas from "./components/Tareas";
import Pomodoro from "./components/Pomodoro";
import Estadisticas from "./components/Estadisticas";
import Configuracion from "./components/Configuracion";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");
    const savedTab = localStorage.getItem("activeTab");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));

        if (savedTab) {
          setActiveTab(savedTab);
        }
      } catch (error) {
        console.error(
          "Error al recuperar la sesión:",
          error
        );

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    const savedTab = localStorage.getItem("activeTab");

    if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab("dashboard");

      localStorage.setItem(
        "activeTab",
        "dashboard"
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    localStorage.setItem(
      "activeTab",
      tab
    );
  };

  const handlePerfilActualizado = (datos) => {
    const actualizado = { ...user, ...datos };
    setUser(actualizado);
    sessionStorage.setItem("user", JSON.stringify(actualizado));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    localStorage.removeItem("activeTab");

    setUser(null);
    setActiveTab("dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">
          Cargando...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-slate-100">

        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />

        <div className="flex-1 min-w-0">

          <Navbar
            activeTab={activeTab}
            user={user}
            onLogout={handleLogout}
            onTabChange={handleTabChange}
          />

          <main className="p-6">

            {activeTab === "dashboard" && (
              <Dashboard onTabChange={handleTabChange} />
            )}

            {activeTab === "tareas" && (
              <Tareas />
            )}

            {activeTab === "pomodoro" && (
              <Pomodoro />
            )}

            {activeTab === "estadisticas" && (
              <Estadisticas />
            )}

          {activeTab === "configuracion" && (
            <Configuracion onPerfilActualizado={handlePerfilActualizado} />
          )}

          </main>

        </div>

      </div>
    </NotificationProvider>
  );
}