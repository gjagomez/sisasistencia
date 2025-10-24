import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import desastreService from '../services/desastreService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Desastres = () => {
  const [desastres, setDesastres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDesastre, setEditingDesastre] = useState(null);
  const [formData, setFormData] = useState({
    nombre_desastre: '',
    tipo_desastre: '',
    fecha_desastre: '',
    ubicacion: '',
    descripcion: ''
  });

  useEffect(() => {
    loadDesastres();
  }, []);

  const loadDesastres = async () => {
    try {
      setLoading(true);
      const data = await desastreService.getAll();
      setDesastres(data);
    } catch (error) {
      console.error('Error al cargar desastres:', error);
      showToast('Error al cargar desastres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDesastre) {
        await desastreService.update(editingDesastre.ID_DESASTRE, formData);
        showToast('Desastre actualizado exitosamente', 'success');
      } else {
        await desastreService.create(formData);
        showToast('Desastre registrado exitosamente', 'success');
      }
      closeModal();
      loadDesastres();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar desastre', 'error');
    }
  };

  const handleEdit = (desastre) => {
    setEditingDesastre(desastre);
    setFormData({
      nombre_desastre: desastre.NOMBRE_DESASTRE || '',
      tipo_desastre: desastre.TIPO_DESASTRE || '',
      fecha_desastre: desastre.FECHA_DESASTRE ? desastre.FECHA_DESASTRE.split('T')[0] : '',
      ubicacion: desastre.UBICACION || '',
      descripcion: desastre.DESCRIPCION || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este desastre?')) {
      try {
        await desastreService.delete(id);
        showToast('Desastre eliminado exitosamente', 'success');
        loadDesastres();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar desastre', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDesastre(null);
    setFormData({
      nombre_desastre: '',
      tipo_desastre: '',
      fecha_desastre: '',
      ubicacion: '',
      descripcion: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando desastres...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><AlertTriangle size={32} /> Desastres Naturales</h1>
          <p>Registro de desastres naturales y emergencias</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Desastre
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {desastres.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center'}}>No hay desastres registrados</td>
              </tr>
            ) : (
              desastres.map((desastre) => (
                <tr key={desastre.ID_DESASTRE}>
                  <td>{desastre.ID_DESASTRE}</td>
                  <td>{desastre.NOMBRE_DESASTRE}</td>
                  <td><span className="badge badge-danger">{desastre.TIPO_DESASTRE}</span></td>
                  <td>{desastre.FECHA_DESASTRE ? new Date(desastre.FECHA_DESASTRE).toLocaleDateString() : '-'}</td>
                  <td>{desastre.UBICACION}</td>
                  <td>{desastre.DESCRIPCION?.substring(0, 50)}{desastre.DESCRIPCION?.length > 50 ? '...' : ''}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(desastre)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(desastre.ID_DESASTRE)} title="Eliminar">
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
        title={editingDesastre ? 'Editar Desastre' : 'Nuevo Desastre'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="desastre-form" className="btn-primary">
              {editingDesastre ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="desastre-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre del Desastre *</label>
              <input
                type="text"
                value={formData.nombre_desastre}
                onChange={(e) => setFormData({...formData, nombre_desastre: e.target.value})}
                required
                placeholder="Ej: Huracán Mitch"
              />
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.tipo_desastre}
                onChange={(e) => setFormData({...formData, tipo_desastre: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Terremoto">Terremoto</option>
                <option value="Huracán">Huracán</option>
                <option value="Inundación">Inundación</option>
                <option value="Deslizamiento">Deslizamiento</option>
                <option value="Incendio">Incendio</option>
                <option value="Sequía">Sequía</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                value={formData.fecha_desastre}
                onChange={(e) => setFormData({...formData, fecha_desastre: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                placeholder="Zona afectada"
              />
            </div>

            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Detalles del desastre"
                rows="4"
              ></textarea>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Desastres;
