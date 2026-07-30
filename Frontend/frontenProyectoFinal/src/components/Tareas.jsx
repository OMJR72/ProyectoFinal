import React, { useState, useEffect } from "react";
import { Search, Pencil, Check, Trash2, Loader2 } from "lucide-react";
import { tareaService } from "../services/tareaService";

const PRIORIDAD_BADGE = {
  ALTA: "bg-red-50 text-red-600",
  MEDIA: "bg-blue-50 text-blue-600",
  BAJA: "bg-green-50 text-green-600",
};

const ESTADO_BADGE = {
  PENDIENTE: "bg-slate-100 text-slate-600",
  EN_PROGRESO: "bg-orange-50 text-orange-600",
  COMPLETADA: "bg-green-50 text-green-600",
};

const PRIORIDAD_LABEL = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
};

const ESTADO_LABEL = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En Progreso",
  COMPLETADA: "Completada",
};

export default function Tareas() {
  const [busqueda, setBusqueda] = useState("");
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tareaService.listar();
      setTareas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 text-sm">
          {error}
        </div>
      ) : tareas.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No hay tareas registradas
        </div>
      ) : (
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
                  t.titulo?.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((tarea) => (
                  <tr key={tarea.id_tarea} className="border-b border-slate-100">
                    <td className="py-3 text-slate-800">{tarea.titulo}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          PRIORIDAD_BADGE[tarea.prioridad] ?? "bg-slate-100"
                        }`}
                      >
                        {PRIORIDAD_LABEL[tarea.prioridad] ?? tarea.prioridad}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          ESTADO_BADGE[tarea.estado] ?? "bg-slate-100"
                        }`}
                      >
                        {ESTADO_LABEL[tarea.estado] ?? tarea.estado}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {tarea.fecha_limite ?? "-"}
                    </td>
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
      )}
    </div>
  );
}
