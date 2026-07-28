import React, { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  ciclosPomodoro,
  tareasVinculables,
  configuracionPomodoro,
} from "../mockData";

function AnilloGrande() {
  const size = 240;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const progreso = 0.68;
  const offset = circunferencia * (1 - progreso);

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
          stroke="#64748B"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-slate-900">25:00</span>
        <span className="mt-2 text-sm font-medium text-slate-500 tracking-wide">
          Ciclo 1: ENFOQUE
        </span>
      </div>
    </div>
  );
}

function SliderConfig({ etiqueta, valor, unidad, max }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{etiqueta}</span>
        <span className="px-2 py-0.5 rounded-md border border-slate-200 text-sm text-slate-700">
          {valor}
          {unidad}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={max}
        defaultValue={valor}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

export default function Pomodoro() {
  const [tareaVinculada, setTareaVinculada] = useState(tareasVinculables[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center">
        <div className="w-full mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Temporizador Pomodoro
          </h2>
          <p className="text-sm text-slate-500">
            Gestiona tus ciclos de enfoque y descansos
          </p>
        </div>

        <AnilloGrande />

        <div className="flex gap-3 mt-8">
          <button className="flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5">
            <Play className="w-4 h-4" /> Comenzar Enfoque
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5">
            <Pause className="w-4 h-4" /> Pausar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>

        <div className="flex items-center gap-2 mt-8 flex-wrap justify-center">
          {ciclosPomodoro.map((ciclo, i) => (
            <React.Fragment key={ciclo.id}>
              <div className="rounded-lg border border-slate-200 px-4 py-3 text-center min-w-[90px]">
                <div className="text-base font-bold text-slate-900">
                  {ciclo.etiqueta}
                </div>
                <div className="text-xs text-slate-500">{ciclo.tipo}</div>
              </div>
              {i < ciclosPomodoro.length - 1 && (
                <span className="text-slate-300">›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="text-base font-semibold text-slate-900">
          Configuración Rápida
        </h3>

        <SliderConfig
          etiqueta="Duración del Enfoque"
          valor={configuracionPomodoro.enfoque}
          unidad="m"
          max={60}
        />
        <SliderConfig
          etiqueta="Break Corto"
          valor={configuracionPomodoro.breakCorto}
          unidad="m"
          max={20}
        />
        <SliderConfig
          etiqueta="Break Largo"
          valor={configuracionPomodoro.breakLargo}
          unidad="m"
          max={30}
        />
        <SliderConfig
          etiqueta="Ciclos hasta Break Largo"
          valor={configuracionPomodoro.ciclosHastaBreakLargo}
          unidad=""
          max={8}
        />

        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Vincular Tarea (Opcional)
          </label>
          <select
            value={tareaVinculada}
            onChange={(e) => setTareaVinculada(e.target.value)}
            className="w-full rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tareasVinculables.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
