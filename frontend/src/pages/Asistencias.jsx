import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HandHeart } from 'lucide-react';
import asistenciaService from '../services/asistenciaService';
import familiaService from '../services/familiaService';
import articuloService from '../services/articuloService';
import Drawer from '../components/Drawer';
import BotonDescargaConstancia from '../components/ConstanciaAsistencia';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsistencia, setEditingAsistencia] = useState(null);
  const [formData, setFormData] = useState({
    id_familia: '',
    tipo_asistencia: 'Alimentaria',
    id_lote: '',
    cantidad_entregada: '',
    valor_estimado: '',
    observaciones: ''
  });

  useEffect(() => {
    loadAsistencias();
    loadFamilias();
    loadLotes();
  }, []);

  const loadAsistencias = async () => {
    try {
      setLoading(true);
      const data = await asistenciaService.getAll();
      setAsistencias(data);
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      showToast('Error al cargar asistencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFamilias = async () => {
    try {
      const data = await familiaService.getAll();
      setFamilias(data);
    } catch (error) {
      console.error('Error al cargar familias:', error);
    }
  };

  const loadLotes = async () => {
    try {
      const data = await articuloService.getAllLotes();
      // Solo mostrar lotes con cantidad disponible
      const lotesDisponibles = data.filter(l => l.CANTIDAD_DISPONIBLE > 0);
      setLotes(lotesDisponibles);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsistencia) {
        await asistenciaService.update(editingAsistencia.ID_ASISTENCIA, formData);
        showToast('Asistencia actualizada exitosamente', 'success');
      } else {
        await asistenciaService.create(formData);
        showToast('Asistencia registrada exitosamente', 'success');
      }
      closeModal();
      loadAsistencias();
      loadLotes(); // Recargar lotes para actualizar cantidades
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar asistencia', 'error');
    }
  };

  const handleEdit = (asistencia) => {
    setEditingAsistencia(asistencia);
    setFormData({
      id_familia: asistencia.ID_FAMILIA || '',
      tipo_asistencia: asistencia.TIPO_ASISTENCIA || 'Alimentaria',
      id_lote: asistencia.ID_LOTE || '',
      cantidad_entregada: asistencia.CANTIDAD_ENTREGADA || '',
      valor_estimado: asistencia.VALOR_ESTIMADO || '',
      observaciones: asistencia.OBSERVACIONES || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta asistencia?')) {
      try {
        await asistenciaService.delete(id);
        showToast('Asistencia eliminada exitosamente', 'success');
        loadAsistencias();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar asistencia', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAsistencia(null);
    setFormData({
      id_familia: '',
      tipo_asistencia: 'Alimentaria',
      id_lote: '',
      cantidad_entregada: '',
      valor_estimado: '',
      observaciones: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando asistencias...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><HandHeart size={32} /> Asistencias</h1>
          <p>Registro de asistencias entregadas a familias</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nueva Asistencia
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Familia</th>
              <th>Tipo</th>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Valor Estimado</th>
              <th>Fecha Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center'}}>No hay asistencias registradas</td>
              </tr>
            ) : (
              asistencias.map((asistencia) => (
                <tr key={asistencia.ID_ASISTENCIA}>
                  <td>{asistencia.ID_ASISTENCIA}</td>
                  <td>{asistencia.JEFE_FAMILIA}</td>
                  <td><span className="badge">{asistencia.TIPO_ASISTENCIA}</span></td>
                  <td>{asistencia.NOMBRE_ARTICULO || '-'}</td>
                  <td>{asistencia.CANTIDAD_ENTREGADA || '-'}</td>
                  <td>{asistencia.VALOR_ESTIMADO ? `Q${asistencia.VALOR_ESTIMADO.toFixed(2)}` : '-'}</td>
                  <td>{asistencia.FECHA_ENTREGA ? new Date(asistencia.FECHA_ENTREGA).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons" style={{ gap: '8px' }}>
                      <BotonDescargaConstancia asistencia={asistencia} />
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(asistencia)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(asistencia.ID_ASISTENCIA)} title="Eliminar">
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
        title={editingAsistencia ? 'Editar Asistencia' : 'Nueva Asistencia'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="asistencia-form" className="btn-primary">
              {editingAsistencia ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="asistencia-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Familia *</label>
              <select
                value={formData.id_familia}
                onChange={(e) => setFormData({...formData, id_familia: e.target.value})}
                required
              >
                <option value="">Seleccione una familia</option>
                {familias.map(familia => (
                  <option key={familia.ID_FAMILIA} value={familia.ID_FAMILIA}>
                    {familia.JEFE_FAMILIA} - {familia.MUNICIPIO}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Asistencia *</label>
              <select
                value={formData.tipo_asistencia}
                onChange={(e) => setFormData({...formData, tipo_asistencia: e.target.value})}
                required
              >
                <option value="Alimentaria">Alimentaria</option>
                <option value="Médica">Médica</option>
                <option value="Vivienda">Vivienda</option>
                <option value="Educación">Educación</option>
                <option value="Ropa">Ropa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lote/Artículo</label>
              <select
                value={formData.id_lote}
                onChange={(e) => setFormData({...formData, id_lote: e.target.value})}
              >
                <option value="">Sin lote específico</option>
                {lotes.map(lote => (
                  <option key={lote.ID_LOTE} value={lote.ID_LOTE}>
                    {lote.NOMBRE_ARTICULO} (Disponible: {lote.CANTIDAD_DISPONIBLE})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cantidad Entregada</label>
              <input
                type="number"
                value={formData.cantidad_entregada}
                onChange={(e) => setFormData({...formData, cantidad_entregada: e.target.value})}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Valor Estimado</label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_estimado}
                onChange={(e) => setFormData({...formData, valor_estimado: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="form-group full-width">
              <label>Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                placeholder="Detalles adicionales de la asistencia"
                rows="3"
              ></textarea>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Asistencias;
