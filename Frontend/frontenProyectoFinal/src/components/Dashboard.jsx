import React from "react";
import { Play, Settings2 } from "lucide-react";
import {
  usuario,
  metricasHoy,
  productividadSemanal,
  pomodoroCompacto,
  tareasPrioritarias,
  actividadReciente,
} from "../mockData";

const PRIORIDAD_ESTILOS = {
  Alta: { barra: "bg-red-500", texto: "text-red-600", badge: "🚩 Alta" },
  Media: { barra: "bg-blue-500", texto: "text-blue-600", badge: "🔷 Media" },
  Baja: { barra: "bg-green-500", texto: "text-green-600", badge: "🟢 Baja" },
};

function GraficaProductividad() {
  const width = 560;
  const height = 180;
  const padding = 24;
  const max = 50;

  const barWidth = (width - padding * 2) / productividadSemanal.length;

  const puntos = productividadSemanal.map((item, i) => {
    const x = padding + barWidth * i + barWidth / 2;
    const y = height - padding - (item.horas / max) * (height - padding * 2);
    return { x, y };
  });

  const linePath = puntos
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      {/* barras */}
      {productividadSemanal.map((item, i) => {
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

      {/* línea de tendencia */}
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

      {/* etiquetas de días */}
      {productividadSemanal.map((item, i) => (
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

function AnilloPomodoro() {
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const offset = circunferencia * (1 - pomodoroCompacto.progreso);

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
          {String(pomodoroCompacto.minutos).padStart(2, "0")}:
          {String(pomodoroCompacto.segundos).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-slate-500">
          Sesión {pomodoroCompacto.sesionActual}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Banner + métrica */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Hola, {usuario.nombre}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Tienes {metricasHoy.tareasPrioritariasHoy} tareas prioritarias para
          hoy y tu meta de estudio va al {metricasHoy.metaPorcentaje}%.
          ¡Sigue así para mantener tu racha semanal!
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Tiempo acumulado hoy: {metricasHoy.tiempoEstudioHoy}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center">
        <span className="text-sm text-slate-500">Tiempo de Estudio Hoy</span>
        <span className="mt-2 text-3xl font-bold text-slate-900">
          {metricasHoy.tiempoEstudioHoy}
        </span>
      </div>

      {/* Gráfica de productividad */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          Gráfica de Productividad Semanal
        </h3>
        <GraficaProductividad />
      </div>

      {/* Pomodoro compacto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center">
        <h3 className="self-start text-base font-semibold text-slate-900 mb-4">
          Pomodoro
        </h3>
        <AnilloPomodoro />
        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
          <button className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2">
            <Play className="w-4 h-4" /> Comenzar
          </button>
          <button className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium py-2">
            <Settings2 className="w-4 h-4" /> Configuración
          </button>
        </div>
        <button className="mt-2 w-full rounded-lg bg-orange-100 text-orange-700 text-sm font-medium py-2">
          Iniciar Tarea
        </button>
      </div>

      {/* Tareas prioritarias */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Tareas Prioritarias
        </h3>
        <ul className="space-y-3">
          {tareasPrioritarias.map((tarea) => {
            const estilo = PRIORIDAD_ESTILOS[tarea.prioridad];
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
        </ul>
      </div>

      {/* Actividad reciente */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Actividad Reciente
        </h3>
        <ul className="relative space-y-5 before:absolute before:left-4 before:top-1 before:bottom-1 before:w-px before:bg-slate-200">
          {actividadReciente.map((item) => (
            <li key={item.id} className="relative flex items-center gap-3 pl-0">
              <img
                src={item.avatar}
                alt={item.nombre}
                className="w-8 h-8 rounded-full object-cover z-10 ring-4 ring-white"
              />
              <p className="text-sm text-slate-700">
                <span className="font-medium">{item.nombre}</span>{" "}
                {item.descripcion}{" "}
                <span className="text-slate-400">{item.tiempo}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
