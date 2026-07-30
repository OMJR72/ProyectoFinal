import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Settings2, Loader2 } from "lucide-react";
import { dashboardService } from "../services/dashboardService";

const PRIORIDAD_ESTILOS = {
  Alta: { barra: "bg-red-500", texto: "text-red-600", badge: "Alta" },
  Media: { barra: "bg-blue-500", texto: "text-blue-600", badge: "Media" },
  Baja: { barra: "bg-green-500", texto: "text-green-600", badge: "Baja" },
};

function GraficaProductividad({ data }) {
  if (!data || data.length === 0) return null;
  const width = 560;
  const height = 180;
  const padding = 24;
  const max = Math.max(...data.map((d) => d.horas), 1);

  const barWidth = (width - padding * 2) / data.length;

  const puntos = data.map((item, i) => {
    const x = padding + barWidth * i + barWidth / 2;
    const y = height - padding - (item.horas / max) * (height - padding * 2);
    return { x, y };
  });

  const linePath = puntos
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      {data.map((item, i) => {
        const barHeight = (item.horas / max) * (height - padding * 2);
        const x = padding + barWidth * i + barWidth * 0.2;
        const y = height - padding - barHeight;
        return (
          <rect
            key={item.dia}
            x={x}
            y={y}
            width={barWidth * 0.6}
            height={barHeight}
            rx={4}
            className="fill-blue-200"
          />
        );
      })}

      <path
        d={linePath}
        fill="none"
        stroke="#0F172A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {puntos.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} className="fill-slate-900" />
      ))}

      {data.map((item, i) => (
        <text
          key={item.dia}
          x={padding + barWidth * i + barWidth / 2}
          y={height - 4}
          textAnchor="middle"
          className="fill-slate-500 text-[10px]"
        >
          {item.dia}
        </text>
      ))}
    </svg>
  );
}

function AnilloPomodoro({ data }) {
  if (!data) return null;
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const offset = circunferencia * (1 - (data.progreso || 0));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3B82F6"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-900">
          {String(data.minutos ?? 0).padStart(2, "0")}:
          {String(data.segundos ?? 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-slate-500">
          Sesión {data.sesionActual ?? 0}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.resumen();
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-sm">{error}</div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Hola, {data.usuario?.nombre}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tienes {data.metricasHoy?.tareasPrioritariasHoy ?? 0} tareas prioritarias para
          hoy y tu meta de estudio va al {data.metricasHoy?.metaPorcentaje ?? 0}%.
          ¡Sigue así para mantener tu racha semanal!
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Tiempo acumulado hoy: {data.metricasHoy?.tiempoEstudioHoy ?? "0h 0m"}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center">
        <span className="text-sm text-slate-500">Tiempo de Estudio Hoy</span>
        <span className="mt-2 text-3xl font-bold text-slate-900">
          {data.metricasHoy?.tiempoEstudioHoy ?? "0h 0m"}
        </span>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          Gráfica de Productividad Semanal
        </h3>
        <GraficaProductividad data={data.productividadSemanal} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center">
        <h3 className="self-start text-base font-semibold text-slate-900 mb-4">
          Pomodoro
        </h3>
        <AnilloPomodoro data={data.pomodoroCompacto} />
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          <button onClick={() => navigate("/pomodoro")} className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2">
            <Play className="w-4 h-4" /> Comenzar
          </button>
          <button onClick={() => navigate("/configuracion")} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium py-2">
            <Settings2 className="w-4 h-4" /> Configuración
          </button>
        </div>
        <button onClick={() => navigate("/tareas")} className="mt-2 w-full rounded-lg bg-orange-100 text-orange-700 text-sm font-medium py-2">
          Iniciar Tarea
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Tareas Prioritarias
        </h3>
        <ul className="space-y-3">
          {(data.tareasPrioritarias ?? []).map((tarea) => {
            const estilo = PRIORIDAD_ESTILOS[tarea.prioridad] ?? PRIORIDAD_ESTILOS.Media;
            return (
              <li key={tarea.id} className="flex items-center gap-3">
                <span className={`w-1 h-8 rounded-full ${estilo.barra}`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    {tarea.titulo}
                  </span>
                  <span className={`text-xs font-medium ${estilo.texto}`}>
                    {estilo.badge}
                  </span>
                </div>
              </li>
            );
          })}
          {(!data.tareasPrioritarias || data.tareasPrioritarias.length === 0) && (
            <p className="text-sm text-slate-400">No hay tareas pendientes</p>
          )}
        </ul>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Actividad Reciente
        </h3>
        <ul className="relative space-y-5 before:absolute before:left-4 before:top-1 before:bottom-1 before:w-px before:bg-slate-200">
          {(data.actividadReciente ?? []).map((item, idx) => (
            <li key={item.id ?? idx} className="relative flex items-center gap-3 pl-0">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium z-10 ring-4 ring-white">
                {(item.nombre ?? "U").charAt(0)}
              </div>
              <p className="text-sm text-slate-700">
                <span className="font-medium">{item.nombre}</span>{" "}
                {item.descripcion}{" "}
                <span className="text-slate-400">{item.tiempo}</span>
              </p>
            </li>
          ))}
          {(!data.actividadReciente || data.actividadReciente.length === 0) && (
            <p className="text-sm text-slate-400">Sin actividad reciente</p>
          )}
        </ul>
      </div>
    </div>
  );
}
