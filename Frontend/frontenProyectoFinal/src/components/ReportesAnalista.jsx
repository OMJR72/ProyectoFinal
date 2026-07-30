import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { analistaService } from "../services/analistaService";
import {
  BarChart3, Users, CheckSquare, Clock,
  TrendingUp, Loader2, Calendar,
} from "lucide-react";

export default function ReportesAnalista() {
  const { user } = useAuth();
  const [reportes, setReportes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analistaService.reportes()
      .then(setReportes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (user?.rol !== "ANALISTA" && user?.rol !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No tienes permisos para ver esta página.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const KPI_CARDS = [
    {
      label: "Usuarios Registrados",
      value: reportes?.totalUsuarios ?? 0,
      icon: Users,
      color: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Tareas Creadas",
      value: reportes?.totalTareas ?? 0,
      icon: CheckSquare,
      color: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Sesiones Pomodoro",
      value: reportes?.totalSesiones ?? 0,
      icon: Clock,
      color: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      label: "Horas de Estudio",
      value: typeof reportes?.totalHorasEstudio === "number"
        ? reportes.totalHorasEstudio.toFixed(1)
        : "0",
      icon: TrendingUp,
      color: "bg-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reportes globales</h1>
          <p className="text-sm text-slate-500 mt-1">
            Estadísticas de todos los usuarios del sistema
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.text}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            Tareas por estado
          </h2>
          <div className="space-y-3">
            {[
              { label: "Completadas", value: reportes?.tareasPorEstado?.completadas ?? 0, color: "bg-green-500" },
              { label: "Pendientes", value: reportes?.tareasPorEstado?.pendientes ?? 0, color: "bg-yellow-500" },
              { label: "En progreso", value: reportes?.tareasPorEstado?.enProgreso ?? 0, color: "bg-blue-500" },
            ].map((item) => {
              const total = reportes?.totalTareas ?? 1;
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Sesiones de estudio
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Hoy</span>
              <span className="text-lg font-bold text-slate-900">{reportes?.sesionesHoy ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Esta semana</span>
              <span className="text-lg font-bold text-slate-900">{reportes?.sesionesEstaSemana ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Totales</span>
              <span className="text-lg font-bold text-slate-900">{reportes?.totalSesiones ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {reportes?.topUsuarios?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Top usuarios por puntos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">#</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Usuario</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Rol</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {reportes.topUsuarios.map((u, i) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{u.nombre}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        u.rol === "ADMIN" ? "bg-purple-100 text-purple-700" :
                        u.rol === "ANALISTA" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{u.rol}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800">{u.puntos ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
