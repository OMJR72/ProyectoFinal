import React from "react";
import {
  LayoutGrid,
  CheckSquare,
  Clock,
  BarChart3,
  Settings,
} from "lucide-react";
import logoImg from "../assets/Logo_Proyecto.png";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "tareas", label: "Tareas", icon: CheckSquare },
  { key: "pomodoro", label: "Pomodoro", icon: Clock },
  { key: "estadisticas", label: "Estadísticas", icon: BarChart3 },
  { key: "configuracion", label: "Configuración", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
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
              onClick={() => setActiveTab(key)}
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
      </nav>

      <div className="px-6 py-4 text-xs text-slate-500">
        Synapse v1.0
      </div>
    </aside>
  );
}