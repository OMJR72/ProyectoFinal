import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

export default function App() {
  const [user, setUser] = useState(null);

  // Al cargar la app, revisamos si ya hay sesión iniciada en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex">
      <Sidebar activeTab="dashboard" setActiveTab={() => {}} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Bienvenido, {user.name || user.email}</h1>
        <button 
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
        >
          Cerrar Sesión
        </button>
      </main>
    </div>
  );
}