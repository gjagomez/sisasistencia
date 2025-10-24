import { useState, useEffect } from 'react';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import reportesService from '../services/reportesService';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const ReporteDonaciones = () => {
  const [reporteConsolidado, setReporteConsolidado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen'); // resumen, donaciones, fondos, estadisticas

  useEffect(() => {
    loadReporteConsolidado();
  }, []);

  const loadReporteConsolidado = async () => {
    try {
      setLoading(true);
      const data = await reportesService.getReporteConsolidado();
      setReporteConsolidado(data);
      showToast('Reporte cargado exitosamente', 'success');
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      showToast('Error al cargar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    showToast('Funcionalidad de exportar PDF en desarrollo', 'info');
    // Aquí puedes implementar la exportación a PDF usando @react-pdf/renderer
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando reporte de donaciones y fondos...</p>
      </div>
    );
  }

  if (!reporteConsolidado) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <span>No se pudo cargar el reporte. Por favor, intente nuevamente.</span>
        </div>
      </div>
    );
  }

  const { resumen, donaciones_recientes, fondos, estadisticas_por_periodo, top_donadores } = reporteConsolidado;

  // Colores para las gráficas
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  // Preparar datos para gráfica de estadísticas por período
  const estadisticasChartData = estadisticas_por_periodo?.data?.slice(0, 12).reverse().map(item => ({
    periodo: item.PERIODO,
    monto: parseFloat(item.MONTO_TOTAL_PERIODO || 0),
    donaciones: parseInt(item.TOTAL_DONACIONES_PERIODO || 0)
  })) || [];

  // Preparar datos para gráfica de fondos (pie chart)
  const fondosChartData = fondos?.data?.map(fondo => ({
    name: fondo.NOMBRE_FONDO,
    value: parseFloat(fondo.SALDO || 0),
    nivel: fondo.NIVEL_FONDO
  })) || [];

  // Preparar datos para gráfica de top donadores
  const topDonadoresChartData = top_donadores?.data?.slice(0, 10).map(donador => ({
    nombre: donador.NOMBRE?.substring(0, 20) || 'N/A',
    monto: parseFloat(donador.MONTO_TOTAL_DONADO || 0),
    categoria: donador.CATEGORIA_DONADOR
  })) || [];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><FileText size={32} /> Reporte de Donaciones y Fondos</h1>
          <p>Análisis completo del estado financiero y donaciones del sistema</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={loadReporteConsolidado}>
            <RefreshCw size={20} />
            Actualizar
          </button>
          <button className="btn-primary" onClick={exportarPDF}>
            <Download size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#dbeafe', color: '#3b82f6', padding: '12px', borderRadius: '8px' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Donaciones</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                Q {parseFloat(resumen?.monto_total_donaciones || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#dcfce7', color: '#22c55e', padding: '12px', borderRadius: '8px' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Saldo Total Fondos</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                Q {parseFloat(resumen?.saldo_total_fondos || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#f59e0b', padding: '12px', borderRadius: '8px' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Número de Donaciones</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                {resumen?.total_donaciones || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#f3e8ff', color: '#8b5cf6', padding: '12px', borderRadius: '8px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Fecha del Reporte</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                {new Date(resumen?.fecha_reporte).toLocaleDateString('es-GT')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={activeTab === 'resumen' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('resumen')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'resumen' ? '3px solid #4f46e5' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'resumen' ? 'bold' : 'normal',
              color: activeTab === 'resumen' ? '#4f46e5' : '#6b7280'
            }}
          >
            Resumen General
          </button>
          <button
            className={activeTab === 'donaciones' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('donaciones')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'donaciones' ? '3px solid #4f46e5' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'donaciones' ? 'bold' : 'normal',
              color: activeTab === 'donaciones' ? '#4f46e5' : '#6b7280'
            }}
          >
            Donaciones Recientes
          </button>
          <button
            className={activeTab === 'fondos' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('fondos')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'fondos' ? '3px solid #4f46e5' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'fondos' ? 'bold' : 'normal',
              color: activeTab === 'fondos' ? '#4f46e5' : '#6b7280'
            }}
          >
            Estado de Fondos
          </button>
          <button
            className={activeTab === 'estadisticas' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('estadisticas')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'estadisticas' ? '3px solid #4f46e5' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'estadisticas' ? 'bold' : 'normal',
              color: activeTab === 'estadisticas' ? '#4f46e5' : '#6b7280'
            }}
          >
            Estadísticas
          </button>
        </div>
      </div>

      {/* Contenido de las Tabs */}
      {activeTab === 'resumen' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Gráfica de Donaciones por Período */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={24} />
              Donaciones por Período
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={estadisticasChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `Q ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="monto" stroke="#4f46e5" strokeWidth={2} name="Monto Total" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Distribución de Fondos */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PieChartIcon size={24} />
              Distribución de Fondos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fondosChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: Q${entry.value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fondosChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Q ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Donadores */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={24} />
              Top 10 Donadores
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDonadoresChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={150} />
                <Tooltip formatter={(value) => `Q ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="monto" fill="#10b981" name="Monto Total Donado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'donaciones' && (
        <div className="table-container">
          <h3 style={{ marginBottom: '15px' }}>Donaciones Recientes</h3>
          <table>
            <thead>
              <tr>
                <th>Donador</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Destino</th>
              </tr>
            </thead>
            <tbody>
              {donaciones_recientes?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No hay donaciones registradas</td>
                </tr>
              ) : (
                donaciones_recientes?.data?.map((donacion, index) => (
                  <tr key={index}>
                    <td>{donacion.NOMBRE_DONADOR || 'N/A'}</td>
                    <td>{donacion.FECHA_DONACION ? new Date(donacion.FECHA_DONACION).toLocaleDateString('es-GT') : '-'}</td>
                    <td><span className="badge">{donacion.TIPO_DONACION}</span></td>
                    <td>Q {parseFloat(donacion.MONTO_MONETARIO || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                    <td>{donacion.DESTINO || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fondos' && (
        <div className="table-container">
          <h3 style={{ marginBottom: '15px' }}>Estado de Fondos</h3>
          <table>
            <thead>
              <tr>
                <th>Fondo</th>
                <th>Saldo</th>
                <th>Porcentaje</th>
                <th>Nivel</th>
                <th>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              {fondos?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No hay fondos registrados</td>
                </tr>
              ) : (
                fondos?.data?.map((fondo, index) => (
                  <tr key={index}>
                    <td>{fondo.NOMBRE_FONDO}</td>
                    <td>Q {parseFloat(fondo.SALDO || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                    <td>{parseFloat(fondo.PORCENTAJE_TOTAL || 0).toFixed(2)}%</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            fondo.NIVEL_FONDO === 'ALTO' ? '#dcfce7' :
                            fondo.NIVEL_FONDO === 'MEDIO' ? '#fef3c7' :
                            fondo.NIVEL_FONDO === 'BAJO' ? '#fee2e2' : '#f3f4f6',
                          color:
                            fondo.NIVEL_FONDO === 'ALTO' ? '#22c55e' :
                            fondo.NIVEL_FONDO === 'MEDIO' ? '#f59e0b' :
                            fondo.NIVEL_FONDO === 'BAJO' ? '#ef4444' : '#6b7280'
                        }}
                      >
                        {fondo.NIVEL_FONDO}
                      </span>
                    </td>
                    <td>{fondo.ULTIMA_ACTUALIZACION ? new Date(fondo.ULTIMA_ACTUALIZACION).toLocaleString('es-GT') : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'estadisticas' && (
        <div>
          <div className="table-container" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Estadísticas por Período</h3>
            <table>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Total Donaciones</th>
                  <th>Monetarias</th>
                  <th>En Especie</th>
                  <th>Mixtas</th>
                  <th>Monto Total</th>
                  <th>Donadores Únicos</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas_por_periodo?.data?.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No hay estadísticas disponibles</td>
                  </tr>
                ) : (
                  estadisticas_por_periodo?.data?.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.PERIODO}</td>
                      <td>{stat.TOTAL_DONACIONES_PERIODO}</td>
                      <td>{stat.DONACIONES_MONETARIAS}</td>
                      <td>{stat.DONACIONES_ESPECIE}</td>
                      <td>{stat.DONACIONES_MIXTAS}</td>
                      <td>Q {parseFloat(stat.MONTO_TOTAL_PERIODO || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                      <td>{stat.DONADORES_UNICOS_PERIODO}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-container">
            <h3 style={{ marginBottom: '15px' }}>Top Donadores</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Total Donaciones</th>
                  <th>Monto Total</th>
                  <th>Categoría</th>
                  <th>Primera Donación</th>
                  <th>Última Donación</th>
                </tr>
              </thead>
              <tbody>
                {top_donadores?.data?.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No hay donadores registrados</td>
                  </tr>
                ) : (
                  top_donadores?.data?.map((donador, index) => (
                    <tr key={index}>
                      <td>{donador.NOMBRE}</td>
                      <td>{donador.TIPO_DONADOR}</td>
                      <td>{donador.TOTAL_DONACIONES}</td>
                      <td>Q {parseFloat(donador.MONTO_TOTAL_DONADO || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              donador.CATEGORIA_DONADOR === 'ORO' ? '#fef3c7' :
                              donador.CATEGORIA_DONADOR === 'PLATA' ? '#f3f4f6' :
                              donador.CATEGORIA_DONADOR === 'BRONCE' ? '#fed7aa' : '#e5e7eb',
                            color:
                              donador.CATEGORIA_DONADOR === 'ORO' ? '#f59e0b' :
                              donador.CATEGORIA_DONADOR === 'PLATA' ? '#6b7280' :
                              donador.CATEGORIA_DONADOR === 'BRONCE' ? '#ea580c' : '#374151'
                          }}
                        >
                          {donador.CATEGORIA_DONADOR}
                        </span>
                      </td>
                      <td>{donador.PRIMERA_DONACION ? new Date(donador.PRIMERA_DONACION).toLocaleDateString('es-GT') : '-'}</td>
                      <td>{donador.ULTIMA_DONACION ? new Date(donador.ULTIMA_DONACION).toLocaleDateString('es-GT') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteDonaciones;
