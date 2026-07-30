import React, { useState, useEffect, useMemo } from "react";
import { Search, Pencil, Check, Trash2, Loader2, Plus, X } from "lucide-react";
import { tareaService } from "../services/tareaService";
import Toast from "./Toast";

const PRIORIDAD_BADGE = {
  ALTA: "bg-red-50 text-red-600", MEDIA: "bg-blue-50 text-blue-600", BAJA: "bg-green-50 text-green-600",
};
const ESTADO_BADGE = {
  PENDIENTE: "bg-slate-100 text-slate-600", EN_PROGRESO: "bg-orange-50 text-orange-600", COMPLETADA: "bg-green-50 text-green-600",
};
const PRIORIDAD_LABEL = { ALTA: "Alta", MEDIA: "Media", BAJA: "Baja" };
const ESTADO_LABEL = { PENDIENTE: "Pendiente", EN_PROGRESO: "En Progreso", COMPLETADA: "Completada" };
const PRIORIDADES = ["ALTA", "MEDIA", "BAJA"];
const ESTADOS = ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"];

const formVacio = {
  titulo: "", descripcion: "", fecha_limite: "", prioridad: "MEDIA", estado: "PENDIENTE",
};

export default function Tareas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODAS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [ordenPor, setOrdenPor] = useState("fecha_limite");
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);

  const mostrarToast = (message, tipo = "success") => setToast({ message, tipo, key: Date.now() });
  const cerrarToast = () => setToast(null);

  useEffect(() => { cargarTareas(); }, []);

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const data = await tareaService.listar();
      setTareas(data);
    } catch (err) {
      mostrarToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const tareasFiltradas = useMemo(() => {
    let resultado = [...tareas];

    if (busqueda) {
      resultado = resultado.filter((t) =>
        t.titulo?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtroPrioridad !== "TODAS") {
      resultado = resultado.filter((t) => t.prioridad === filtroPrioridad);
    }
    if (filtroEstado !== "TODOS") {
      resultado = resultado.filter((t) => t.estado === filtroEstado);
    }

    resultado.sort((a, b) => {
      switch (ordenPor) {
        case "fecha_limite": {
          if (!a.fecha_limite) return 1;
          if (!b.fecha_limite) return -1;
          return a.fecha_limite.localeCompare(b.fecha_limite);
        }
        case "fecha_limite_desc": {
          if (!a.fecha_limite) return 1;
          if (!b.fecha_limite) return -1;
          return b.fecha_limite.localeCompare(a.fecha_limite);
        }
        case "titulo":
          return (a.titulo || "").localeCompare(b.titulo || "");
        case "prioridad": {
          const orden = { ALTA: 0, MEDIA: 1, BAJA: 2 };
          return (orden[a.prioridad] ?? 1) - (orden[b.prioridad] ?? 1);
        }
        case "estado": {
          const ordenEstado = { PENDIENTE: 0, EN_PROGRESO: 1, COMPLETADA: 2 };
          return (ordenEstado[a.estado] ?? 0) - (ordenEstado[b.estado] ?? 0);
        }
        default:
          return 0;
      }
    });

    return resultado;
  }, [tareas, busqueda, filtroPrioridad, filtroEstado, ordenPor]);

  const abrirModalNueva = () => { setEditando(null); setFormData(formVacio); setShowModal(true); };
  const cerrarModal = () => { setShowModal(false); setEditando(null); setFormData(formVacio); };

  const abrirModalEditar = (tarea) => {
    setEditando(tarea);
    setFormData({
      titulo: tarea.titulo || "", descripcion: tarea.descripcion || "",
      fecha_limite: tarea.fecha_limite || "", prioridad: tarea.prioridad || "MEDIA", estado: tarea.estado || "PENDIENTE",
    });
    setShowModal(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = { ...formData };
      if (!payload.fecha_limite) payload.fecha_limite = null;
      if (editando) {
        await tareaService.actualizar(editando.id_tarea, payload);
        mostrarToast("Tarea actualizada correctamente");
      } else {
        await tareaService.crear(payload);
        mostrarToast("Tarea creada correctamente");
      }
      cerrarModal();
      await cargarTareas();
    } catch (err) {
      mostrarToast(err.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  const completarTarea = async (id) => {
    try {
      await tareaService.actualizar(id, { estado: "COMPLETADA" });
      mostrarToast("Tarea marcada como completada");
      await cargarTareas();
    } catch (err) {
      mostrarToast(err.message, "error");
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await tareaService.eliminar(id);
      mostrarToast("Tarea eliminada correctamente");
      await cargarTareas();
    } catch (err) {
      mostrarToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast key={toast.key} message={toast.message} tipo={toast.tipo} onClose={cerrarToast} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo de Tareas</h2>
          <p className="text-sm text-slate-500">Listado Completo y Filtros</p>
        </div>
        <button onClick={abrirModalNueva} className="flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2.5">
          <Plus className="w-4 h-4" /> Nueva Tarea
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar tarea..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)} className="rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="TODAS">Filtrar por: Prioridad</option>
          {PRIORIDADES.map((p) => (<option key={p} value={p}>{PRIORIDAD_LABEL[p]}</option>))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="TODOS">Filtrar por: Estado</option>
          {ESTADOS.map((e) => (<option key={e} value={e}>{ESTADO_LABEL[e]}</option>))}
        </select>
        <select value={ordenPor} onChange={(e) => setOrdenPor(e.target.value)} className="rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="fecha_limite">Ordenar por: Fecha límite ↑</option>
          <option value="fecha_limite_desc">Ordenar por: Fecha límite ↓</option>
          <option value="titulo">Ordenar por: Nombre</option>
          <option value="prioridad">Ordenar por: Prioridad</option>
          <option value="estado">Ordenar por: Estado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : tareasFiltradas.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No hay tareas registradas. Crea una nueva.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50">
                <th className="py-3 px-4 font-medium">Tarea</th>
                <th className="py-3 px-4 font-medium">Prioridad</th>
                <th className="py-3 px-4 font-medium">Estado</th>
                <th className="py-3 px-4 font-medium">Fecha Límite</th>
                <th className="py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareasFiltradas.map((tarea) => (
                <tr key={tarea.id_tarea} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-800">{tarea.titulo}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${PRIORIDAD_BADGE[tarea.prioridad] ?? "bg-slate-100"}`}>
                      {PRIORIDAD_LABEL[tarea.prioridad] ?? tarea.prioridad}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${ESTADO_BADGE[tarea.estado] ?? "bg-slate-100"}`}>
                      {ESTADO_LABEL[tarea.estado] ?? tarea.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tarea.fecha_limite ?? "-"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirModalEditar(tarea)} aria-label="Editar tarea" className="text-slate-400 hover:text-blue-500"><Pencil className="w-4 h-4" /></button>
                      {tarea.estado !== "COMPLETADA" && (
                        <button onClick={() => completarTarea(tarea.id_tarea)} aria-label="Completar tarea" className="text-slate-400 hover:text-green-500"><Check className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => eliminarTarea(tarea.id_tarea)} aria-label="Eliminar tarea" className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">{editando ? "Editar Tarea" : "Nueva Tarea"}</h3>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Límite</label>
                <input type="date" name="fecha_limite" value={formData.fecha_limite} onChange={handleChange} className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
                  <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PRIORIDADES.map((p) => (<option key={p} value={p}>{PRIORIDAD_LABEL[p]}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {ESTADOS.map((e) => (<option key={e} value={e}>{ESTADO_LABEL[e]}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={cerrarModal} className="rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2">Cancelar</button>
                <button type="submit" disabled={guardando} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-4 py-2 disabled:opacity-50">{guardando ? "Guardando..." : editando ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
