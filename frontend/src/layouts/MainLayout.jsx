import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  DollarSign,
  Heart,
  Package,
  HandHeart,
  AlertTriangle,
  FileText,
  Wallet,
  Menu,
  X,
  BarChart3,
  Building2,
  UserCog,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  PackageOpen
} from 'lucide-react';
import { authService } from '../services/authService';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({
    admin: false,
    donaciones: false,
    inventario: false,
    beneficiarios: false
  });
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleModule = (moduleKey) => {
    setExpandedModules(prev => {
      const isCurrentlyExpanded = prev[moduleKey];

      // Si el módulo ya está expandido, lo contraemos
      if (isCurrentlyExpanded) {
        return {
          ...prev,
          [moduleKey]: false
        };
      }

      // Si el módulo está contraído, lo expandimos y contraemos todos los demás
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = key === moduleKey;
      });

      return newState;
    });
  };

  const menuModules = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      single: true
    },
    {
      key: 'admin',
      label: 'Administrativo',
      icon: Building2,
      items: [
        { path: '/empresa', icon: Building2, label: 'Empresa' },
        { path: '/empleados', icon: Users, label: 'Empleados' },
        { path: '/usuarios', icon: UserCog, label: 'Usuarios' }
      ]
    },
    {
      key: 'donaciones',
      label: 'Donaciones',
      icon: DollarSign,
      items: [
        { path: '/donadores', icon: Users, label: 'Donadores' },
        { path: '/donaciones', icon: DollarSign, label: 'Donaciones' },
        { path: '/fondos', icon: Wallet, label: 'Fondos' }
      ]
    },
    {
      key: 'inventario',
      label: 'Inventario',
      icon: Package,
      items: [
        { path: '/inventario', icon: Package, label: 'Artículos' },
        { path: '/lotes', icon: PackageOpen, label: 'Lotes de Artículos' }
      ]
    },
    {
      key: 'beneficiarios',
      label: 'Beneficiarios',
      icon: Heart,
      items: [
        { path: '/desastres', icon: AlertTriangle, label: 'Desastres' },
        { path: '/familias', icon: Heart, label: 'Familias Beneficiadas' },
        { path: '/beneficiados', icon: Users, label: 'Beneficiados' },
        { path: '/apadrinamientos', icon: HandHeart, label: 'Apadrinamientos' },
        { path: '/asistencias', icon: FileText, label: 'Asistencias' },
        { path: '/estudios', icon: FileText, label: 'Estudios Socioeconómicos' }
      ]
    },
    {
      key: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      single: true
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <AlertTriangle size={28} />
            <span>Sistema de Asistencia</span>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuModules.map((module) => {
            const ModuleIcon = module.icon;

            // Si es un item single (Dashboard, Reportes)
            if (module.single) {
              const isActive = location.pathname === module.path;
              return (
                <Link
                  key={module.key}
                  to={module.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <ModuleIcon size={20} />
                  <span>{module.label}</span>
                </Link>
              );
            }

            // Si es un módulo con submenús
            const isExpanded = expandedModules[module.key];
            const hasActiveChild = module.items.some(item => location.pathname === item.path);

            return (
              <div key={module.key} className="nav-module">
                <div
                  className={`nav-module-header ${hasActiveChild ? 'has-active' : ''}`}
                  onClick={() => toggleModule(module.key)}
                >
                  <div className="nav-module-header-content">
                    <ModuleIcon size={20} />
                    <span>{module.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={18} className="chevron" />
                  ) : (
                    <ChevronRight size={18} className="chevron" />
                  )}
                </div>

                {isExpanded && (
                  <div className="nav-module-items">
                    {module.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`nav-subitem ${isActive ? 'active' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <ItemIcon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {authService.getCurrentUser()?.nombre?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">
                {authService.getCurrentUser()?.nombre || 'Usuario'}
              </div>
              <div className="user-role">
                {authService.getCurrentUser()?.rol || 'Usuario'}
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <div className="top-bar-title">
            <h1>Sistema de Asistencia a Víctimas de Desastres Naturales</h1>
          </div>

          <div className="top-bar-actions">
            <div className="notification-icon">
              <AlertTriangle size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
