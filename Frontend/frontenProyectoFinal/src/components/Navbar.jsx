import React from "react";
import { Bell } from "lucide-react";
import { usuario } from "../mockData";

const TITULOS = {
  dashboard: "Dashboard",
  tareas: "Tareas",
  pomodoro: "Pomodoro",
  estadisticas: "Estadísticas",
  configuracion: "Configuración",
};

export default function Navbar({ activeTab }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-slate-900 px-8 py-4">
      <h1 className="text-lg font-semibold text-white">
        {TITULOS[activeTab] ?? "Synapse"}
      </h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src={usuario.avatar}
            alt={usuario.nombreCompleto}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-slate-100">
            {usuario.nombreCompleto}
          </span>
        </div>
      </div>
    </header>
  );
}
