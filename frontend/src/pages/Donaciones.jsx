import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import donacionService from '../services/donacionService';
import donadorService from '../services/donadorService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Donaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [donadores, setDonadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDonacion, setEditingDonacion] = useState(null);
  const [formData, setFormData] = useState({
    id_donador: '',
    tipo_donacion: 'Monetaria',
    monto_monetario: '',
    descripcion_especie: '',
    destino: ''
  });

  useEffect(() => {
    loadDonaciones();
    loadDonadores();
  }, []);

  const loadDonaciones = async () => {
    try {
      setLoading(true);
      const data = await donacionService.getAll();
      setDonaciones(data);
    } catch (error) {
      console.error('Error al cargar donaciones:', error);
      showToast('Error al cargar donaciones', 'error');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDonacion) {
        await donacionService.update(editingDonacion.ID_DONACION, formData);
        showToast('Donación actualizada exitosamente', 'success');
      } else {
        await donacionService.create(formData);
        showToast('Donación registrada exitosamente', 'success');
      }
      closeModal();
      loadDonaciones();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar donación', 'error');
    }
  };

  const handleEdit = (donacion) => {
    setEditingDonacion(donacion);
    setFormData({
      id_donador: donacion.ID_DONADOR || '',
      tipo_donacion: donacion.TIPO_DONACION || 'Monetaria',
      monto_monetario: donacion.MONTO_MONETARIO || '',
      descripcion_especie: donacion.DESCRIPCION_ESPECIE || '',
      destino: donacion.DESTINO || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta donación?')) {
      try {
        await donacionService.delete(id);
        showToast('Donación eliminada exitosamente', 'success');
        loadDonaciones();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar donación', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDonacion(null);
    setFormData({
      id_donador: '',
      tipo_donacion: 'Monetaria',
      monto_monetario: '',
      descripcion_especie: '',
      destino: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando donaciones...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><DollarSign size={32} /> Donaciones</h1>
          <p>Gestión de donaciones monetarias y en especie</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nueva Donación
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Donador</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Destino</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {donaciones.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center'}}>No hay donaciones registradas</td>
              </tr>
            ) : (
              donaciones.map((donacion) => (
                <tr key={donacion.ID_DONACION}>
                  <td>{donacion.ID_DONACION}</td>
                  <td>{donacion.NOMBRE_DONADOR}</td>
                  <td>{donacion.FECHA_DONACION ? new Date(donacion.FECHA_DONACION).toLocaleDateString() : '-'}</td>
                  <td><span className="badge">{donacion.TIPO_DONACION}</span></td>
                  <td>{donacion.MONTO_MONETARIO ? `Q${donacion.MONTO_MONETARIO.toFixed(2)}` : '-'}</td>
                  <td>{donacion.DESCRIPCION_ESPECIE || '-'}</td>
                  <td>{donacion.DESTINO || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(donacion)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(donacion.ID_DONACION)} title="Eliminar">
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
        title={editingDonacion ? 'Editar Donación' : 'Nueva Donación'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="donacion-form" className="btn-primary">
              {editingDonacion ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="donacion-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Donador *</label>
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
              <label>Tipo de Donación *</label>
              <select
                value={formData.tipo_donacion}
                onChange={(e) => setFormData({...formData, tipo_donacion: e.target.value})}
                required
              >
                <option value="Monetaria">Monetaria</option>
                <option value="Especie">Especie</option>
                <option value="Mixta">Mixta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Monto Monetario</label>
              <input
                type="number"
                step="0.01"
                value={formData.monto_monetario}
                onChange={(e) => setFormData({...formData, monto_monetario: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Destino</label>
              <input
                type="text"
                value={formData.destino}
                onChange={(e) => setFormData({...formData, destino: e.target.value})}
                placeholder="Ej: Fondo general, Familia específica"
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción en Especie</label>
              <textarea
                value={formData.descripcion_especie}
                onChange={(e) => setFormData({...formData, descripcion_especie: e.target.value})}
                placeholder="Descripción de artículos donados"
                rows="3"
              ></textarea>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Donaciones;
