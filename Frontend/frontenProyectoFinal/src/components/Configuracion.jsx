import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usuarioService } from "../services/usuarioService";

const CONFIG_KEY = "pomodoro_config";

function configPorDefecto() {
  return { enfoque: 25, breakCorto: 5, breakLargo: 15, ciclosHastaBreakLargo: 4 };
}

function cargarConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : configPorDefecto();
  } catch {
    return configPorDefecto();
  }
}

function guardarConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

const TABS = ["Mi Perfil", "Preferencias Pomodoro", "Notificaciones", "Seguridad"];

function CampoTexto({ etiqueta, valorInicial, tipo = "text", onChange }) {
  const [valor, setValor] = useState(valorInicial ?? "");

  useEffect(() => {
    setValor(valorInicial ?? "");
  }, [valorInicial]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{etiqueta}</label>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        placeholder={etiqueta}
        className="w-full rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function PanelMiPerfil({ perfil, onGuardar }) {
  const [editando, setEditando] = useState({ ...perfil });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setEditando({ ...perfil });
  }, [perfil]);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await onGuardar({ nombre: editando.nombre, apellido: editando.apellido });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
          {((perfil?.nombre ?? "U").charAt(0) + (perfil?.apellido ?? "").charAt(0)) || "U"}
        </div>
        <button className="rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-1.5">
          Cambiar Foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoTexto etiqueta="Nombre" valorInicial={editando.nombre} onChange={(v) => setEditando({ ...editando, nombre: v })} />
        <CampoTexto etiqueta="Apellido" valorInicial={editando.apellido} onChange={(v) => setEditando({ ...editando, apellido: v })} />
        <CampoTexto etiqueta="Correo Electrónico" valorInicial={editando.email} tipo="email" />
        <CampoTexto etiqueta="Nombre de Usuario" valorInicial={editando.nombreUsuario} />
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleGuardar} disabled={guardando} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 flex items-center gap-2 disabled:opacity-50">
          {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar Cambios
        </button>
        <button className="rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function SliderMini({ etiqueta, valor, unidad, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{etiqueta}</span>
        <span className="text-sm text-slate-500">{valor}{unidad}</span>
      </div>
      <input type="range" min={1} max={60} value={valor} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue-500" />
    </div>
  );
}

function PanelPreferenciasPomodoro({ config, onActualizarConfig }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <h3 className="text-base font-semibold text-slate-900">Preferencias Pomodoro</h3>
      <SliderMini etiqueta="Enfoque" valor={config.enfoque} unidad="m" onChange={(v) => onActualizarConfig("enfoque", v)} />
      <SliderMini etiqueta="Break Corto" valor={config.breakCorto} unidad="m" onChange={(v) => onActualizarConfig("breakCorto", v)} />
      <SliderMini etiqueta="Break Largo" valor={config.breakLargo} unidad="m" onChange={(v) => onActualizarConfig("breakLargo", v)} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">Ciclos hasta Break Largo</span>
        <span className="text-sm text-slate-500">{config.ciclosHastaBreakLargo}</span>
      </div>
    </div>
  );
}

function PanelSeguridad() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Seguridad</h3>
      <button className="w-full rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-2.5">
        Cambiar Contraseña
      </button>
    </div>
  );
}

export default function Configuracion() {
  const [tabActiva, setTabActiva] = useState(TABS[0]);
  const [perfil, setPerfil] = useState(null);
  const [pomodoroConfig, setPomodoroConfig] = useState(cargarConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.obtenerPerfil();
      setPerfil(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarPerfil = async (data) => {
    const updated = await usuarioService.actualizarPerfil(data);
    setPerfil({ ...perfil, ...updated });
  };

  const actualizarConfig = (key, value) => {
    const nueva = { ...pomodoroConfig, [key]: value };
    setPomodoroConfig(nueva);
    guardarConfig(nueva);
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Configuración</h2>
        <p className="text-sm text-slate-500">Gestiona tu cuenta, preferencias y personaliza tu experiencia de estudio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActiva(tab)}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tabActiva === tab ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {tabActiva === "Mi Perfil" && <PanelMiPerfil perfil={perfil} onGuardar={handleGuardarPerfil} />}
          {tabActiva === "Preferencias Pomodoro" && <PanelPreferenciasPomodoro config={pomodoroConfig} onActualizarConfig={actualizarConfig} />}
          {tabActiva === "Notificaciones" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-500">
              Aquí se configurarán las preferencias de notificaciones.
            </div>
          )}
          {tabActiva === "Seguridad" && <PanelSeguridad />}
        </div>

        <div className="space-y-6">
          <PanelPreferenciasPomodoro config={pomodoroConfig} onActualizarConfig={actualizarConfig} />
          <PanelSeguridad />
        </div>
      </div>
    </div>
  );
}
