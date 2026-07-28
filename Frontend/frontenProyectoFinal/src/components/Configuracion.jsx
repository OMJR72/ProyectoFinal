import React, { useState } from "react";
import { usuario, perfilUsuario, configuracionPomodoro } from "../mockData";

const TABS = ["Mi Perfil", "Preferencias Pomodoro", "Notificaciones", "Seguridad"];

function CampoTexto({ etiqueta, valorInicial, tipo = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {etiqueta}
      </label>
      <input
        type={tipo}
        defaultValue={valorInicial}
        placeholder={etiqueta}
        className="w-full rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function PanelMiPerfil() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={usuario.avatar}
          alt={perfilUsuario.nombre}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <button className="rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-1.5">
          Cambiar Foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoTexto etiqueta="Nombre" valorInicial={perfilUsuario.nombre} />
        <CampoTexto etiqueta="Apellido" valorInicial={perfilUsuario.apellido} />
        <CampoTexto
          etiqueta="Correo Electrónico"
          valorInicial={perfilUsuario.correo}
          tipo="email"
        />
        <CampoTexto
          etiqueta="Nombre de Usuario"
          valorInicial={perfilUsuario.nombreUsuario}
        />
        <CampoTexto etiqueta="Título" valorInicial={perfilUsuario.titulo} />
      </div>

      <div className="flex gap-3 mt-6">
        <button className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-5 py-2.5">
          Guardar Cambios
        </button>
        <button className="rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function SliderMini({ etiqueta, valor, unidad }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{etiqueta}</span>
        <span className="text-sm text-slate-500">
          {valor}
          {unidad}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={60}
        defaultValue={valor}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

function PanelPreferenciasPomodoro() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <h3 className="text-base font-semibold text-slate-900">
        Preferencias Pomodoro
      </h3>
      <SliderMini etiqueta="Enfoque" valor={configuracionPomodoro.enfoque} unidad="m" />
      <SliderMini
        etiqueta="Break Corto"
        valor={configuracionPomodoro.breakCorto}
        unidad="m"
      />
      <SliderMini
        etiqueta="Break Largo"
        valor={configuracionPomodoro.breakLargo}
        unidad="m"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">Ciclos hasta Break Largo</span>
        <span className="text-sm text-slate-500">
          {configuracionPomodoro.ciclosHastaBreakLargo}
        </span>
      </div>
    </div>
  );
}

function PanelSeguridad() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Seguridad
      </h3>
      <button className="w-full rounded-lg border border-slate-200 text-sm font-medium text-slate-700 px-4 py-2.5">
        Cambiar Contraseña
      </button>
    </div>
  );
}

export default function Configuracion() {
  const [tabActiva, setTabActiva] = useState(TABS[0]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Configuración</h2>
        <p className="text-sm text-slate-500">
          Gestiona tu cuenta, preferencias y personaliza tu experiencia de
          estudio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActiva(tab)}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tabActiva === tab
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {tabActiva === "Mi Perfil" && <PanelMiPerfil />}
          {tabActiva === "Preferencias Pomodoro" && <PanelPreferenciasPomodoro />}
          {tabActiva === "Notificaciones" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-500">
              Aquí se configurarán las preferencias de notificaciones.
            </div>
          )}
          {tabActiva === "Seguridad" && <PanelSeguridad />}
        </div>

        <div className="space-y-6">
          <PanelPreferenciasPomodoro />
          <PanelSeguridad />
        </div>
      </div>
    </div>
  );
}
