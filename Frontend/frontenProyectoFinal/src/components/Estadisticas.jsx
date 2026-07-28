import React from "react";
import { ChevronDown } from "lucide-react";
import {
  kpisEstadisticas,
  productividadSemanal,
  distribucionCategoria,
  distribucionProyecto,
} from "../mockData";

const COLORES_DONA = ["#3B82F6", "#64748B", "#94A3B8", "#CBD5E1"];

function GraficaBarras() {
  const width = 480;
  const height = 200;
  const padding = 28;
  const max = 50;
  const barWidth = (width - padding * 2) / productividadSemanal.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
      {[0, 12.5, 25, 37.5, 50].map((v) => {
        const y = height - padding - (v / max) * (height - padding * 2);
        return (
          <line
            key={v}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        );
      })}
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
            className="fill-slate-400"
          />
        );
      })}
      {productividadSemanal.map((item, i) => (
        <text
          key={item.dia}
          x={padding + barWidth * i + barWidth / 2}
          y={height - 6}
          textAnchor="middle"
          className="fill-slate-500 text-[10px]"
        >
          {item.dia}
        </text>
      ))}
    </svg>
  );
}

function GraficaDona() {
  const size = 160;
  const radius = size / 2;
  const grosor = 28;
  let acumulado = 0;

  const segmentos = distribucionCategoria.map((item, i) => {
    const inicio = acumulado;
    acumulado += item.porcentaje;
    return { ...item, inicio, fin: acumulado, color: COLORES_DONA[i] };
  });

  function coordenadas(porcentaje) {
    const angulo = (porcentaje / 100) * 2 * Math.PI - Math.PI / 2;
    return [radius + radius * Math.cos(angulo), radius + radius * Math.sin(angulo)];
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-40 h-40">
      {segmentos.map((seg) => {
        const [x1, y1] = coordenadas(seg.inicio);
        const [x2, y2] = coordenadas(seg.fin);
        const grandeArco = seg.fin - seg.inicio > 50 ? 1 : 0;
        return (
          <path
            key={seg.categoria}
            d={`M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${grandeArco} 1 ${x2} ${y2} Z`}
            fill={seg.color}
          />
        );
      })}
      <circle cx={radius} cy={radius} r={radius - grosor} fill="#FFFFFF" />
    </svg>
  );
}

export default function Estadisticas() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Estadísticas de Rendimiento
          </h2>
          <p className="text-sm text-slate-500">
            Resumen de hábitos de estudio, tiempo enfocado y tareas completadas.
          </p>
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-3 py-2">
          Esta semana <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisEstadisticas.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <p className="text-sm text-slate-500">{kpi.etiqueta}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {kpi.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Rendimiento Semanal
          </h3>
          <GraficaBarras />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Distribución por Categoría
          </h3>
          <div className="flex items-center gap-6">
            <GraficaDona />
            <ul className="space-y-2 text-sm">
              {distribucionCategoria.map((item, i) => (
                <li key={item.categoria} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORES_DONA[i] }}
                  />
                  <span className="text-slate-700">{item.categoria}</span>
                  <span className="text-slate-400">{item.porcentaje}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Distribución por Materia/Proyecto
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 font-medium">Proyecto</th>
                <th className="py-2 font-medium">Horas</th>
                <th className="py-2 font-medium">Sesiones</th>
                <th className="py-2 font-medium">Meta</th>
              </tr>
            </thead>
            <tbody>
              {distribucionProyecto.map((item) => (
                <tr key={item.proyecto} className="border-b border-slate-100">
                  <td className="py-3 text-slate-800">{item.proyecto}</td>
                  <td className="py-3 text-slate-600">{item.horas}</td>
                  <td className="py-3 text-slate-600">{item.sesiones}</td>
                  <td className="py-3 text-slate-600">{item.meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
