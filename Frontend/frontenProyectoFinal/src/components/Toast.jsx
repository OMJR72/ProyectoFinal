import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const ESTILOS = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICONOS = {
  success: CheckCircle,
  error: XCircle,
  info: CheckCircle,
};

export default function Toast({ message, tipo = "success", onClose, duracion = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duracion);
    return () => clearTimeout(timer);
  }, [onClose, duracion]);

  const Icono = ICONOS[tipo] || ICONOS.info;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium ${ESTILOS[tipo] || ESTILOS.info}`}>
      <Icono className="w-4 h-4" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
