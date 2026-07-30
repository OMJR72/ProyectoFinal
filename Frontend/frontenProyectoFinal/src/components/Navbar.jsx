import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User, X, CheckCircle, Clock, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const TITULOS = {
  dashboard: "Dashboard",
  tareas: "Tareas",
  pomodoro: "Pomodoro",
  estadisticas: "Estadísticas",
  configuracion: "Configuración",
};

const ICONOS_TIPO = {
  success: <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />,
  pomodoro: <Clock className="w-4 h-4 text-blue-500 shrink-0" />,
  info: <Info className="w-4 h-4 text-slate-500 shrink-0" />,
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, dismissNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbierto, setNotifAbierto] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nombreCompleto = user
    ? `${user.nombre} ${user.apellido}`
    : "Usuario";

  const iniciales = user
    ? `${user.nombre?.charAt(0) ?? ""}${user.apellido?.charAt(0) ?? ""}`
    : "U";

  const fotoPerfil = user?.foto ? `http://localhost:8080${user.foto}` : null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-900 px-8 py-4">

      <h1 className="text-lg font-semibold text-white">
        {TITULOS[activeTab] ?? "Synapse"}
      </h1>

      <div className="flex items-center gap-5">

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notificaciones"
            onClick={() => setNotifAbierto(!notifAbierto)}
            className="relative text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {notifAbierto && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Notificaciones</span>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">Sin notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 px-3 py-3 border-b border-slate-50 hover:bg-slate-50 group">
                      {ICONOS_TIPO[n.type] ?? ICONOS_TIPO.info}
                      <p className="text-sm text-slate-700 flex-1">{n.message}</p>
                      <button
                        type="button"
                        onClick={() => dismissNotification(n.id)}
                        className="text-slate-300 hover:text-slate-500 shrink-0"
                        title="Cerrar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">

          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-colors"
          >
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
                {iniciales}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-100">
                {nombreCompleto}
              </p>
              <p className="text-xs">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  user?.rol === "ADMIN" ? "bg-purple-500/20 text-purple-300" :
                  user?.rol === "ANALISTA" ? "bg-blue-500/20 text-blue-300" :
                  "bg-slate-500/20 text-slate-400"
                }`}>
                  {user?.rol ?? "Usuario"}
                </span>
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${menuAbierto ? "rotate-180" : ""}`}
            />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  {fotoPerfil ? (
                    <img src={fotoPerfil} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center text-white text-base font-medium">
                      {iniciales}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {nombreCompleto}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email ?? ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => { setMenuAbierto(false); navigate("/configuracion"); }}
                >
                  <User className="w-4 h-4" />
                  Mi perfil
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
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
