import { useState, useEffect } from 'react';
import { Plus, Trash2, HandHeart, Check } from 'lucide-react';
import apadrinamientoService from '../services/apadrinamientoService';
import donadorService from '../services/donadorService';
import familiaService from '../services/familiaService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Apadrinamientos = () => {
  const [apadrinamientos, setApadrinamientos] = useState([]);
  const [donadores, setDonadores] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_donador: '',
    id_familia: '',
    estado: 'Activo'
  });

  useEffect(() => {
    loadApadrinamientos();
    loadDonadores();
    loadFamilias();
  }, []);

  const loadApadrinamientos = async () => {
    try {
      setLoading(true);
      const data = await apadrinamientoService.getAll();
      setApadrinamientos(data);
    } catch (error) {
      console.error('Error al cargar apadrinamientos:', error);
      showToast('Error al cargar apadrinamientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDonadores = async () => {
    try {
      const data = await donadorService.getAll();
      setDonadores(data);
    } catch (error) {
      console.error('Error al cargar donadores:', error);
    }
  };

  const loadFamilias = async () => {
    try {
      const data = await familiaService.getAll();
      // Solo mostrar familias no apadrinadas
      const familiasNoApadrinadas = data.filter(f => f.ES_APADRINADA === 'No');
      setFamilias(familiasNoApadrinadas);
    } catch (error) {
      console.error('Error al cargar familias:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apadrinamientoService.create(formData);
      showToast('Apadrinamiento registrado exitosamente', 'success');
      closeModal();
      loadApadrinamientos();
      loadFamilias(); // Recargar familias para actualizar las disponibles
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar apadrinamiento', 'error');
    }
  };

  const handleFinalizar = async (id) => {
    if (window.confirm('¿Está seguro de finalizar este apadrinamiento?')) {
      try {
        await apadrinamientoService.finalizar(id);
        showToast('Apadrinamiento finalizado exitosamente', 'success');
        loadApadrinamientos();
        loadFamilias();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al finalizar apadrinamiento', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este apadrinamiento?')) {
      try {
        await apadrinamientoService.delete(id);
        showToast('Apadrinamiento eliminado exitosamente', 'success');
        loadApadrinamientos();
        loadFamilias();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar apadrinamiento', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      id_donador: '',
      id_familia: '',
      estado: 'Activo'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando apadrinamientos...</p>
      </div>
    );
  }

  const apadrinamientosActivos = apadrinamientos.filter(a => a.ESTADO === 'Activo').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><HandHeart size={32} /> Apadrinamientos</h1>
          <p>Gestión de apadrinamientos de familias</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Apadrinamiento
        </button>
      </div>

      <div className="stats-summary" style={{marginBottom: '20px'}}>
        <div className="stat-card">
          <h3>Apadrinamientos Activos</h3>
          <p className="stat-value">{apadrinamientosActivos}</p>
        </div>
        <div className="stat-card">
          <h3>Total Apadrinamientos</h3>
          <p className="stat-value">{apadrinamientos.length}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Padrino/Madrina</th>
              <th>Familia</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apadrinamientos.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center'}}>No hay apadrinamientos registrados</td>
              </tr>
            ) : (
              apadrinamientos.map((apadrinamiento) => (
                <tr key={apadrinamiento.ID_APADRINAMIENTO}>
                  <td>{apadrinamiento.ID_APADRINAMIENTO}</td>
                  <td>{apadrinamiento.NOMBRE_PADRINO}</td>
                  <td>{apadrinamiento.JEFE_FAMILIA}</td>
                  <td>{apadrinamiento.FECHA_INICIO ? new Date(apadrinamiento.FECHA_INICIO).toLocaleDateString() : '-'}</td>
                  <td>{apadrinamiento.FECHA_FIN ? new Date(apadrinamiento.FECHA_FIN).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${apadrinamiento.ESTADO === 'Activo' ? 'badge-success' : 'badge-secondary'}`}>
                      {apadrinamiento.ESTADO}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {apadrinamiento.ESTADO === 'Activo' && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleFinalizar(apadrinamiento.ID_APADRINAMIENTO)}
                          title="Finalizar"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(apadrinamiento.ID_APADRINAMIENTO)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={showModal}
        onClose={closeModal}
        title="Nuevo Apadrinamiento"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="apadrinamiento-form" className="btn-primary" disabled={familias.length === 0}>
              Guardar
            </button>
          </>
        }
      >
        <form id="apadrinamiento-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Padrino/Madrina *</label>
              <select
                value={formData.id_donador}
                onChange={(e) => setFormData({...formData, id_donador: e.target.value})}
                required
              >
                <option value="">Seleccione un donador</option>
                {donadores.map(donador => (
                  <option key={donador.ID_DONADOR} value={donador.ID_DONADOR}>
                    {donador.NOMBRE}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Familia a Apadrinar *</label>
              <select
                value={formData.id_familia}
                onChange={(e) => setFormData({...formData, id_familia: e.target.value})}
                required
              >
                <option value="">Seleccione una familia</option>
                {familias.map(familia => (
                  <option key={familia.ID_FAMILIA} value={familia.ID_FAMILIA}>
                    {familia.JEFE_FAMILIA} ({familia.CANTIDAD_MIEMBROS} miembros)
                  </option>
                ))}
              </select>
              {familias.length === 0 && (
                <small style={{color: '#e74c3c'}}>No hay familias disponibles para apadrinar</small>
              )}
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Apadrinamientos;
