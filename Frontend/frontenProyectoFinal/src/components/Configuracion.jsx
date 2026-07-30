import React, { useEffect, useState, useRef } from "react";
import { Loader2, Eye, EyeOff, Bell, BellOff, Camera } from "lucide-react";
import { usuarioService } from "../services/usuarioService";
import { useAuth } from "../context/AuthContext";

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

const BASE_URL = 'http://localhost:8080';

function PanelMiPerfil({ perfil, onGuardar, onFotoSubida }) {
  const fileInputRef = useRef(null);
  const [editando, setEditando] = useState({ ...perfil });
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(perfil?.foto ? BASE_URL + perfil.foto : null);

  useEffect(() => {
    setEditando({ ...perfil });
    setFotoUrl(perfil?.foto ? BASE_URL + perfil.foto : null);
  }, [perfil]);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await onGuardar({ nombre: editando.nombre, apellido: editando.apellido });
    } finally {
      setGuardando(false);
    }
  };

  const handleSubirFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoFoto(true);
    try {
      const res = await usuarioService.subirFoto(file);
      setFotoUrl(BASE_URL + res.foto);
      if (onFotoSubida) onFotoSubida(res.foto);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert("Error al subir la foto: " + err.message);
    } finally {
      setSubiendoFoto(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-20 h-20 mb-3">
          {fotoUrl ? (
            <img src={fotoUrl} alt="Foto de perfil" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {((perfil?.nombre ?? "U").charAt(0) + (perfil?.apellido ?? "").charAt(0)) || "U"}
            </div>
          )}
          {subiendoFoto && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleSubirFoto}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={subiendoFoto}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-1.5 hover:bg-slate-50 disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5" />
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

function SliderMini({ etiqueta, valor, unidad, onChange, min = 1, max = 60 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{etiqueta}</span>
        <span className="text-sm text-slate-500">{valor}{unidad}</span>
      </div>
      <input type="range" min={min} max={max} value={valor} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue-500" />
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
      <SliderMini etiqueta="Ciclos hasta Break Largo" valor={config.ciclosHastaBreakLargo} unidad="" onChange={(v) => onActualizarConfig("ciclosHastaBreakLargo", v)} min={1} max={10} />
    </div>
  );
}

const NOTIF_KEY = "notificacion_prefs";

function notifPrefsPorDefecto() {
  return { notificacionesActivas: true };
}

function cargarNotifPrefs() {
  try {
    const saved = localStorage.getItem(NOTIF_KEY);
    return saved ? JSON.parse(saved) : notifPrefsPorDefecto();
  } catch {
    return notifPrefsPorDefecto();
  }
}

function guardarNotifPrefs(prefs) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
}

function Toggle({ activo, onChange, iconoOn, iconoOff, etiqueta }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {activo ? iconoOn : iconoOff}
        <span className="text-sm text-slate-700">{etiqueta}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!activo)}
        className={`relative w-10 h-6 rounded-full transition-colors ${activo ? "bg-blue-500" : "bg-slate-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${activo ? "translate-x-4" : ""}`} />
      </button>
    </div>
  );
}

function PanelNotificaciones() {
  const [prefs, setPrefs] = useState(cargarNotifPrefs);

  const actualizar = (key, valor) => {
    const nueva = { ...prefs, [key]: valor };
    setPrefs(nueva);
    guardarNotifPrefs(nueva);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Preferencias de Notificaciones</h3>
      <p className="text-sm text-slate-500 mb-4">Por ahora solo están disponibles las notificaciones dentro de la aplicación.</p>
      <div className="space-y-1">
        <Toggle
          activo={prefs.notificacionesActivas}
          onChange={(v) => actualizar("notificacionesActivas", v)}
          iconoOn={<Bell className="w-4 h-4 text-blue-500" />}
          iconoOff={<BellOff className="w-4 h-4 text-slate-400" />}
          etiqueta="Notificaciones en la aplicación"
        />
      </div>
    </div>
  );
}

function PanelSeguridad() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPasswords, setMostrarPasswords] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCambiarPassword = async () => {
    setMensaje(null);
    setErrorMsg(null);
    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas nuevas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    setGuardando(true);
    try {
      const res = await usuarioService.cambiarPassword({ currentPassword, newPassword });
      setMensaje(res.mensaje || "Contraseña actualizada");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMostrarFormulario(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Seguridad</h3>
      {mostrarFormulario ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
            <div className="relative">
              <input
                type={mostrarPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={() => setMostrarPasswords(!mostrarPasswords)} className="absolute right-3 top-2.5 text-slate-400">
                {mostrarPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
            <input
              type={mostrarPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
            <input
              type={mostrarPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
          <div className="flex gap-3">
            <button onClick={handleCambiarPassword} disabled={guardando} className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-50 flex items-center gap-2">
              {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
              Guardar
            </button>
            <button onClick={() => { setMostrarFormulario(false); setErrorMsg(null); setMensaje(null); }} className="rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setMostrarFormulario(true)} className="w-full rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-2.5 hover:bg-slate-50">
          Cambiar Contraseña
        </button>
      )}
    </div>
  );
}

export default function Configuracion() {
  const { actualizarPerfil } = useAuth();
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
    const nuevoPerfil = { ...perfil, ...updated };
    setPerfil(nuevoPerfil);
    actualizarPerfil({ nombre: nuevoPerfil.nombre, apellido: nuevoPerfil.apellido });
  };

  const handleFotoSubida = (foto) => {
    setPerfil(prev => ({ ...prev, foto }));
    actualizarPerfil({ foto });
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

          {tabActiva === "Mi Perfil" && <PanelMiPerfil perfil={perfil} onGuardar={handleGuardarPerfil} onFotoSubida={handleFotoSubida} />}
          {tabActiva === "Preferencias Pomodoro" && <PanelPreferenciasPomodoro config={pomodoroConfig} onActualizarConfig={actualizarConfig} />}
          {tabActiva === "Notificaciones" && <PanelNotificaciones />}
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
