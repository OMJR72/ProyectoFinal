import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Tareas from "./components/Tareas";
import Pomodoro from "./components/Pomodoro";
import Estadisticas from "./components/Estadisticas";
import Configuracion from "./components/Configuracion";
import AdminUsuarios from "./components/AdminUsuarios";
import ReportesAnalista from "./components/ReportesAnalista";
import { NotificationProvider } from "./context/NotificationContext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tareas" element={<Tareas />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="reportes" element={<ReportesAnalista />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </NotificationProvider>
  );
}
