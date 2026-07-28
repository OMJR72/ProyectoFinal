import React, { useState } from "react";
import { Search, Pencil, Check, Trash2 } from "lucide-react";
import { tareas } from "../mockData";

const PRIORIDAD_BADGE = {
  Alta: "bg-red-50 text-red-600",
  Media: "bg-blue-50 text-blue-600",
  Baja: "bg-green-50 text-green-600",
};

const ESTADO_BADGE = {
  "En Proceso": "bg-orange-50 text-orange-600",
  Pendiente: "bg-slate-100 text-slate-600",
  Bloqueada: "bg-red-50 text-red-600",
};

export default function Tareas() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Módulo de Tareas
        </h2>
        <p className="text-sm text-slate-500">
          Listado Completo y Filtros
        </p>
      </div>

      {/* Barra de controles */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar tarea..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Filtrar por: Prioridad</option>
          <option>Filtrar por: Estado</option>
        </select>

        <select className="rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Ordenar por: Fecha límite</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 font-medium">Tarea</th>
              <th className="py-2 font-medium">Prioridad</th>
              <th className="py-2 font-medium">Estado</th>
              <th className="py-2 font-medium">Fecha Límite</th>
              <th className="py-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas
              .filter((t) =>
                t.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((tarea) => (
                <tr key={tarea.id} className="border-b border-slate-100">
                  <td className="py-3 text-slate-800">{tarea.nombre}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        PRIORIDAD_BADGE[tarea.prioridad]
                      }`}
                    >
                      {tarea.prioridad}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        ESTADO_BADGE[tarea.estado]
                      }`}
                    >
                      {tarea.estado}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{tarea.fechaLimite}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Editar tarea"
                        className="text-slate-400 hover:text-blue-500"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        aria-label="Completar tarea"
                        className="text-slate-400 hover:text-green-500"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        aria-label="Eliminar tarea"
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
