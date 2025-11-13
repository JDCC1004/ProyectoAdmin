import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Activos from "./pages/Activos";
import Licencias from "./pages/Licencias";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";

// ============================================
// RUTA PRIVADA (validación de sesión y rol)
// ============================================
const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  // Si no hay token → redirigir al login
  if (!token) return <Navigate to="/login" replace />;

  // Si hay restricción de rol y el usuario no cumple
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA DE LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PRIVADAS */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Página principal (Dashboard) */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Módulos */}
          <Route path="activos" element={<Activos />} />
          <Route path="licencias" element={<Licencias />} />

          <Route
            path="usuarios"
            element={
              <PrivateRoute roles={["administrador"]}>
                <Usuarios />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Redirección por defecto para rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
