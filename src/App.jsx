import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Activos from "./pages/Activos";
import Licencias from "./pages/Licencias";
import Usuarios from "./pages/Usuarios";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="activos" element={<Activos />} />
          <Route path="licencias" element={<Licencias />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </Router>
  );
}