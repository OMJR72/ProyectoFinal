import React, { useState } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { usuario } from "../mockData";

const TITULOS = {
  dashboard: "Dashboard",
  tareas: "Tareas",
  pomodoro: "Pomodoro",
  estadisticas: "Estadísticas",
  configuracion: "Configuración",
};

export default function Navbar({ activeTab, onLogout }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-900 px-8 py-4">

      <h1 className="text-lg font-semibold text-white">
        {TITULOS[activeTab] ?? "Synapse"}
      </h1>

      <div className="flex items-center gap-5">

        <button
          type="button"
          aria-label="Notificaciones"
          className="relative text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">

          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-colors"
          >

            <img
              src={usuario.avatar}
              alt={usuario.nombreCompleto}
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-100">
                {usuario.nombreCompleto}
              </p>

              <p className="text-xs text-slate-400">
                {usuario.titulo}
              </p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                menuAbierto ? "rotate-180" : ""
              }`}
            />

          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">

              <div className="p-4 border-b border-slate-200">

                <div className="flex items-center gap-3">

                  <img
                    src={usuario.avatar}
                    alt={usuario.nombreCompleto}
                    className="w-11 h-11 rounded-full object-cover"
                  />

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {usuario.nombreCompleto}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {usuario.correo}
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-2">

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  <User className="w-4 h-4" />
                  Mi perfil
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}