import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiService";
import { Shield, Trash2, Save, X, Loader2, Search, ChevronDown } from "lucide-react";

const ROLES = [
  { id: 1, nombre: "USER" },
  { id: 2, nombre: "ANALISTA" },
  { id: 3, nombre: "ADMIN" },
];

const BADGE_ROLES = {
  ADMIN: "bg-purple-100 text-purple-700",
  ANALISTA: "bg-blue-100 text-blue-700",
  USER: "bg-slate-100 text-slate-600",
};

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [rolDropdown, setRolDropdown] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await api.get("/admin/usuarios");
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const iniciarEdicion = (u) => {
    setEditId(u.id);
    setEditData({ nombre: u.nombre, apellido: u.apellido, email: u.email, rolId: u.rolId });
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditData({});
    setRolDropdown(null);
  };

  const guardarCambios = async (id) => {
    try {
      await api.put(`/admin/usuarios/${id}`, {
        nombre: editData.nombre,
        apellido: editData.apellido,
        email: editData.email,
      });
      if (editData.rolId) {
        await api.put(`/admin/usuarios/${id}/rol`, { rolId: editData.rolId });
      }
      cancelarEdicion();
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar", err);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await api.del(`/admin/usuarios/${id}`);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar", err);
    }
  };

  const seleccionarRol = (rolId) => {
    setEditData((prev) => ({ ...prev, rolId }));
    setRolDropdown(null);
  };

  const filtrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (user?.rol !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No tienes permisos para ver esta página.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los usuarios del sistema ({usuarios.length} registrados)
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Rol</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Puntos</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filtrados.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{u.id}</td>
                    <td className="px-4 py-3">
                      {editId === u.id ? (
                        <div className="flex gap-2">
                          <input
                            value={editData.nombre}
                            onChange={(e) => setEditData((p) => ({ ...p, nombre: e.target.value }))}
                            className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                          />
                          <input
                            value={editData.apellido}
                            onChange={(e) => setEditData((p) => ({ ...p, apellido: e.target.value }))}
                            className="w-24 px-2 py-1 border border-slate-200 rounded text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium text-slate-800">{u.nombre} {u.apellido}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === u.id ? (
                        <input
                          value={editData.email}
                          onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))}
                          className="w-40 px-2 py-1 border border-slate-200 rounded text-sm"
                        />
                      ) : (
                        <span className="text-slate-600">{u.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === u.id ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setRolDropdown(rolDropdown === u.id ? null : u.id)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                          >
                            <span className="font-medium">{ROLES.find((r) => r.id === editData.rolId)?.nombre ?? u.rol}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          {rolDropdown === u.id && (
                            <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-xl z-10">
                              {ROLES.map((r) => (
                                <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => seleccionarRol(r.id)}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${editData.rolId === r.id ? "bg-slate-50 font-semibold" : ""}`}
                                >
                                  {r.nombre}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${BADGE_ROLES[u.rol] || "bg-slate-100 text-slate-600"}`}>
                          <Shield className="w-3 h-3" />
                          {u.rol}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.puntos ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      {editId === u.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => guardarCambios(u.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Guardar"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelarEdicion}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => iniciarEdicion(u)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {user?.id !== u.id && (
                            <button
                              type="button"
                              onClick={() => eliminarUsuario(u.id)}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
