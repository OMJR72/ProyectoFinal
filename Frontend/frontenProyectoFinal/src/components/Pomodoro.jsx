import React, { useEffect, useState, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { tareaService } from "../services/tareaService";
import { sesionService } from "../services/sesionService";
import { useNotifications } from "../context/NotificationContext";

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

function AnilloGrande({ minutos, segundos, progreso, etapa }) {
  const size = 240;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radius;
  const offset = circunferencia * (1 - (progreso ?? 0));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#64748B" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circunferencia} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-slate-900">
          {String(minutos ?? 0).padStart(2, "0")}:{String(segundos ?? 0).padStart(2, "0")}
        </span>
        <span className="mt-2 text-sm font-medium text-slate-500 tracking-wide">
          {etapa ?? "Listo para comenzar"}
        </span>
      </div>
    </div>
  );
}

function SliderConfig({ etiqueta, valor, unidad, max, onChange, disabled }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{etiqueta}</span>
        <span className="px-2 py-0.5 rounded-md border border-slate-200 text-sm text-slate-700">{valor}{unidad}</span>
      </div>
      <input type="range" min={1} max={max} value={valor} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled} className="w-full accent-blue-500 disabled:opacity-40" />
    </div>
  );
}

function generarFases(config) {
  const fases = [];
  for (let i = 0; i < config.ciclosHastaBreakLargo; i++) {
    fases.push("focus");
    if (i < config.ciclosHastaBreakLargo - 1) fases.push("shortBreak");
  }
  fases.push("longBreak");
  return fases;
}

export default function Pomodoro() {
  const [tareas, setTareas] = useState([]);
  const [tareaVinculada, setTareaVinculada] = useState("");
  const [config, setConfig] = useState(cargarConfig);
  const [loading, setLoading] = useState(true);
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [paso, setPaso] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(config.enfoque * 60);
  const sesionIdRef = useRef(null);
  const intervalRef = useRef(null);
  const { addNotification } = useNotifications();

  const FASES = useMemo(() => generarFases(config), [config]);
  const faseActual = FASES[paso];
  const totalFases = FASES.length;

  const duracionFase =
    faseActual === "focus"
      ? config.enfoque * 60
      : faseActual === "longBreak"
      ? config.breakLargo * 60
      : config.breakCorto * 60;

  const progreso = duracionFase > 0 ? 1 - tiempoRestante / duracionFase : 0;
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  useEffect(() => {
    cargarTareas();
  }, []);

  useEffect(() => {
    if (!activo || pausado) return;
    intervalRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [activo, pausado, paso]);

  useEffect(() => {
    if (tiempoRestante === 0 && activo) {
      avanzarFase();
    }
  }, [tiempoRestante]);

  const cargarTareas = async () => {
    try {
      const data = await tareaService.listar();
      setTareas(data ?? []);
    } catch {
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  const actualizarConfig = (key, value) => {
    const nueva = { ...config, [key]: value };
    setConfig(nueva);
    guardarConfig(nueva);
  };

  const iniciarCiclo = () => {
    setPaso(0);
    setTiempoRestante(config.enfoque * 60);
    setActivo(true);
    setPausado(false);
    crearSesion();
  };

  const crearSesion = () => {
    const ahora = new Date();
    sesionService.crear({
      fecha_inicio: ahora.toISOString().slice(0, 19),
      duracion_minutos: config.enfoque,
      estado: "EN_PROGRESO",
    }).then((data) => {
      sesionIdRef.current = data.id || data.sesion_id;
    }).catch(() => {});
  };

  const avanzarFase = () => {
    if (faseActual === "focus" && sesionIdRef.current) {
      const ahora = new Date();
      sesionService.actualizar(sesionIdRef.current, {
        fecha_fin: ahora.toISOString().slice(0, 19),
        estado: "COMPLETADA",
      }).catch(() => {});
      sesionIdRef.current = null;
      addNotification("Ciclo de enfoque completado", "pomodoro");
    }

    const siguiente = paso + 1;
    if (siguiente >= totalFases) {
      setActivo(false);
      setPausado(false);
      setPaso(0);
      setTiempoRestante(config.enfoque * 60);
      addNotification("Ciclo Pomodoro completado", "success");
      return;
    }

    const sigFase = FASES[siguiente];
    const sigDuracion =
      sigFase === "focus"
        ? config.enfoque * 60
        : sigFase === "longBreak"
        ? config.breakLargo * 60
        : config.breakCorto * 60;

    setPaso(siguiente);
    setTiempoRestante(sigDuracion);

    if (sigFase === "focus") {
      crearSesion();
    }
  };

  const pausar = () => {
    setPausado(true);
    clearInterval(intervalRef.current);
  };

  const reanudar = () => {
    setPausado(false);
  };

  const reiniciar = () => {
    clearInterval(intervalRef.current);
    setActivo(false);
    setPausado(false);
    setPaso(0);
    setTiempoRestante(config.enfoque * 60);
    sesionIdRef.current = null;
  };

  const nombreEtapa = () => {
    if (!activo) return pausado ? "Pausado" : "Listo para comenzar";
    const numCiclo = Math.floor(paso / 2) + 1;
    switch (faseActual) {
      case "focus": return `Ciclo ${numCiclo}: ENFOQUE`;
      case "shortBreak": return `Descanso Corto`;
      case "longBreak": return `Descanso Largo`;
      default: return "";
    }
  };

  const btnStyle = "flex items-center gap-2 rounded-lg text-sm font-semibold px-5 py-2.5";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center">
        <div className="w-full mb-6">
          <h2 className="text-xl font-bold text-slate-900">Temporizador Pomodoro</h2>
          <p className="text-sm text-slate-500">Gestiona tus ciclos de enfoque y descansos</p>
        </div>

        <AnilloGrande minutos={minutos} segundos={segundos} progreso={progreso} etapa={nombreEtapa()} />

        <div className="flex gap-3 mt-8">
          {!activo ? (
            <button onClick={iniciarCiclo} className={`${btnStyle} bg-slate-900 text-white`}>
              <Play className="w-4 h-4" /> Comenzar Ciclo
            </button>
          ) : pausado ? (
            <button onClick={reanudar} className={`${btnStyle} bg-slate-900 text-white`}>
              <Play className="w-4 h-4" /> Reanudar
            </button>
          ) : (
            <button onClick={pausar} className={`${btnStyle} border border-slate-200 text-slate-700`}>
              <Pause className="w-4 h-4" /> Pausar
            </button>
          )}
          <button onClick={reiniciar} className={`${btnStyle} border border-slate-200 text-slate-700`}>
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>

        <div className="flex items-center gap-2 mt-8 flex-wrap justify-center">
          {FASES.map((fase, i) => {
            const label = fase === "focus" ? "Focus" : fase === "longBreak" ? "Descanso Largo" : "Descanso";
            const dur = fase === "focus" ? config.enfoque : fase === "longBreak" ? config.breakLargo : config.breakCorto;
            return (
              <React.Fragment key={i}>
                <div className={`rounded-lg border px-4 py-3 text-center min-w-[90px] ${i === paso && activo ? "border-slate-900 bg-slate-50" : "border-slate-200"} ${!activo ? "opacity-60" : ""}`}>
                  <div className="text-base font-bold text-slate-900">{dur}m</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
                {i < FASES.length - 1 && <span className="text-slate-300">›</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="text-base font-semibold text-slate-900">Configuración Rápida</h3>

        <SliderConfig etiqueta="Duración del Enfoque" valor={config.enfoque} unidad="m" max={60} onChange={(v) => actualizarConfig("enfoque", v)} disabled={activo} />
        <SliderConfig etiqueta="Break Corto" valor={config.breakCorto} unidad="m" max={20} onChange={(v) => actualizarConfig("breakCorto", v)} disabled={activo} />
        <SliderConfig etiqueta="Break Largo" valor={config.breakLargo} unidad="m" max={30} onChange={(v) => actualizarConfig("breakLargo", v)} disabled={activo} />
        <SliderConfig etiqueta="Ciclos hasta Break Largo" valor={config.ciclosHastaBreakLargo} unidad="" max={8} onChange={(v) => actualizarConfig("ciclosHastaBreakLargo", v)} disabled={activo} />

        <div>
          <label className="block text-sm text-slate-700 mb-1">Vincular Tarea (Opcional)</label>
          <select value={tareaVinculada} onChange={(e) => setTareaVinculada(e.target.value)} className="w-full rounded-lg border border-slate-200 text-sm text-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Sin tarea --</option>
            {tareas.map((t) => (
              <option key={t.id_tarea} value={t.id_tarea}>{t.titulo}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
