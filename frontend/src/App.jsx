import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Donadores from './pages/Donadores';
import Donaciones from './pages/Donaciones';
import Familias from './pages/Familias';
import Beneficiados from './pages/Beneficiados';
import Apadrinamientos from './pages/Apadrinamientos';
import Inventario from './pages/Inventario';
import Asistencias from './pages/Asistencias';
import Desastres from './pages/Desastres';
import Estudios from './pages/Estudios';
import Fondos from './pages/Fondos';
import ReporteDonaciones from './pages/ReporteDonaciones';
import Login from './pages/Login';
import ToastContainer from './components/ToastContainer';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componentes temporales para las rutas que faltan
const ComingSoon = ({ title }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p style={{ color: '#64748b' }}>Este módulo está en desarrollo</p>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Módulo Administrativo */}
            <Route path="empresa" element={<ComingSoon title="Empresa" />} />
            <Route path="empleados" element={<ComingSoon title="Empleados" />} />
            <Route path="usuarios" element={<ComingSoon title="Usuarios" />} />

            {/* Módulo de Donaciones */}
            <Route path="donadores" element={<Donadores />} />
            <Route path="donaciones" element={<Donaciones />} />
            <Route path="fondos" element={<Fondos />} />

            {/* Módulo de Inventario */}
            <Route path="inventario" element={<Inventario />} />
            <Route path="lotes" element={<ComingSoon title="Lotes de Artículos" />} />

            {/* Módulo de Beneficiarios */}
            <Route path="desastres" element={<Desastres />} />
            <Route path="familias" element={<Familias />} />
            <Route path="beneficiados" element={<Beneficiados />} />
            <Route path="apadrinamientos" element={<Apadrinamientos />} />
            <Route path="asistencias" element={<Asistencias />} />
            <Route path="estudios" element={<Estudios />} />

            {/* Reportes */}
            <Route path="reportes" element={<ReporteDonaciones />} />
          </Route>

          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
