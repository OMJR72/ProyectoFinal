import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  CheckSquare,
  Clock,
  BarChart3,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/Logo_Proyecto.png";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "tareas", label: "Tareas", icon: CheckSquare },
  { key: "pomodoro", label: "Pomodoro", icon: Clock },
  { key: "estadisticas", label: "Estadísticas", icon: BarChart3 },
  { key: "configuracion", label: "Configuración", icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop();

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-200 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <img
          src={logoImg}
          alt="Logo Synapse"
          className="w-9 h-9 object-contain"
        />
        <span className="text-xl font-semibold text-white tracking-tight">
          Synapse
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigate(`/${key}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
        {(user?.rol === "ANALISTA" || user?.rol === "ADMIN") && (
          <button
            type="button"
            onClick={() => navigate("/reportes")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "reportes"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            Reportes
          </button>
        )}
        {user?.rol === "ADMIN" && (
          <button
            type="button"
            onClick={() => navigate("/usuarios")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "usuarios"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            Usuarios
          </button>
        )}
      </nav>

      <div className="px-6 py-4 space-y-2">
        {user?.rol === "ANALISTA" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-900/30 border border-blue-700/30 rounded-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">Analista</span>
          </div>
        )}
        <div className="text-xs text-slate-500">
          Synapse v1.0
        </div>
      </div>
    </aside>
  );
}
