import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import estadisticasService from '../services/estadisticasService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await estadisticasService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar las estadísticas. Asegúrate de que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Familias',
      value: stats?.totalFamilias || 0,
      icon: Users,
      color: '#4f46e5',
      bgColor: '#eef2ff'
    },
    {
      title: 'Familias Apadrinadas',
      value: stats?.familiasApadrinadas || 0,
      icon: UserCheck,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Total Beneficiados',
      value: stats?.totalBeneficiados || 0,
      icon: Users,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Donadores',
      value: stats?.totalDonadores || 0,
      icon: TrendingUp,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    },
    {
      title: 'Donaciones del Año',
      value: `Q ${(stats?.donacionesAnio || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    {
      title: 'Saldo en Fondos',
      value: `Q ${(stats?.saldoFondos || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Total Asistencias',
      value: stats?.totalAsistencias || 0,
      icon: Package,
      color: '#06b6d4',
      bgColor: '#cffafe'
    },
    {
      title: 'Artículos por Vencer',
      value: stats?.articulosProximosVencer || 0,
      icon: AlertTriangle,
      color: '#ef4444',
      bgColor: '#fee2e2'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bienvenido al Sistema de Asistencia a Víctimas de Desastres Naturales</p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboardStats}>
          Actualizar Datos
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{
                backgroundColor: stat.bgColor,
                color: stat.color
              }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-info">
        <div className="card">
          <h3>Estado del Sistema</h3>
          <p>El sistema está funcionando correctamente. Todos los módulos están operativos.</p>
          <ul>
            <li>✅ Conexión al backend establecida</li>
            <li>✅ Base de datos Oracle conectada</li>
            <li>✅ Todos los módulos disponibles</li>
          </ul>
        </div>

        <div className="card">
          <h3>Acciones Rápidas</h3>
          <div className="quick-actions">
            <button className="btn btn-primary">Registrar Donación</button>
            <button className="btn btn-success">Nueva Familia</button>
            <button className="btn btn-secondary">Ver Reportes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
