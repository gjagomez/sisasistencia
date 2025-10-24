import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import familiaService from '../services/familiaService';
import desastreService from '../services/desastreService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Familias = () => {
  const [familias, setFamilias] = useState([]);
  const [desastres, setDesastres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFamilia, setEditingFamilia] = useState(null);
  const [formData, setFormData] = useState({
    jefe_familia: '',
    cantidad_miembros: '',
    direccion: '',
    municipio: '',
    departamento: '',
    es_apadrinada: 'No',
    id_desastre_asociado: ''
  });

  useEffect(() => {
    loadFamilias();
    loadDesastres();
  }, []);

  const loadFamilias = async () => {
    try {
      setLoading(true);
      const data = await familiaService.getAll();
      setFamilias(data);
    } catch (error) {
      console.error('Error al cargar familias:', error);
      showToast('Error al cargar familias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDesastres = async () => {
    try {
      const data = await desastreService.getAll();
      setDesastres(data);
    } catch (error) {
      console.error('Error al cargar desastres:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFamilia) {
        await familiaService.update(editingFamilia.ID_FAMILIA, formData);
        showToast('Familia actualizada exitosamente', 'success');
      } else {
        await familiaService.create(formData);
        showToast('Familia registrada exitosamente', 'success');
      }
      closeModal();
      loadFamilias();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar familia', 'error');
    }
  };

  const handleEdit = (familia) => {
    setEditingFamilia(familia);
    setFormData({
      jefe_familia: familia.JEFE_FAMILIA || '',
      cantidad_miembros: familia.CANTIDAD_MIEMBROS || '',
      direccion: familia.DIRECCION || '',
      municipio: familia.MUNICIPIO || '',
      departamento: familia.DEPARTAMENTO || '',
      es_apadrinada: familia.ES_APADRINADA || 'No',
      id_desastre_asociado: familia.ID_DESASTRE_ASOCIADO || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta familia?')) {
      try {
        await familiaService.delete(id);
        showToast('Familia eliminada exitosamente', 'success');
        loadFamilias();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar familia', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFamilia(null);
    setFormData({
      jefe_familia: '',
      cantidad_miembros: '',
      direccion: '',
      municipio: '',
      departamento: '',
      es_apadrinada: 'No',
      id_desastre_asociado: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando familias...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><Users size={32} /> Familias Beneficiadas</h1>
          <p>Gestión de familias beneficiadas por la organización</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nueva Familia
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jefe de Familia</th>
              <th>Miembros</th>
              <th>Ubicación</th>
              <th>Apadrinada</th>
              <th>Desastre</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {familias.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center'}}>No hay familias registradas</td>
              </tr>
            ) : (
              familias.map((familia) => (
                <tr key={familia.ID_FAMILIA}>
                  <td>{familia.ID_FAMILIA}</td>
                  <td>{familia.JEFE_FAMILIA}</td>
                  <td>{familia.CANTIDAD_MIEMBROS}</td>
                  <td>{familia.MUNICIPIO}, {familia.DEPARTAMENTO}</td>
                  <td>
                    <span className={`badge ${familia.ES_APADRINADA === 'Sí' ? 'badge-success' : 'badge-secondary'}`}>
                      {familia.ES_APADRINADA}
                    </span>
                  </td>
                  <td>{familia.NOMBRE_DESASTRE || '-'}</td>
                  <td>{familia.FECHA_REGISTRO ? new Date(familia.FECHA_REGISTRO).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(familia)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(familia.ID_FAMILIA)} title="Eliminar">
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
        title={editingFamilia ? 'Editar Familia' : 'Nueva Familia'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="familia-form" className="btn-primary">
              {editingFamilia ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="familia-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Jefe de Familia *</label>
              <input
                type="text"
                value={formData.jefe_familia}
                onChange={(e) => setFormData({...formData, jefe_familia: e.target.value})}
                required
                placeholder="Nombre del jefe de familia"
              />
            </div>

            <div className="form-group">
              <label>Cantidad de Miembros *</label>
              <input
                type="number"
                value={formData.cantidad_miembros}
                onChange={(e) => setFormData({...formData, cantidad_miembros: e.target.value})}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Departamento</label>
              <input
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                placeholder="Ej: Guatemala"
              />
            </div>

            <div className="form-group">
              <label>Municipio</label>
              <input
                type="text"
                value={formData.municipio}
                onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                placeholder="Ej: Guatemala"
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                placeholder="Dirección completa"
              />
            </div>

            <div className="form-group">
              <label>Desastre Asociado</label>
              <select
                value={formData.id_desastre_asociado}
                onChange={(e) => setFormData({...formData, id_desastre_asociado: e.target.value})}
              >
                <option value="">Ninguno</option>
                {desastres.map(desastre => (
                  <option key={desastre.ID_DESASTRE} value={desastre.ID_DESASTRE}>
                    {desastre.NOMBRE_DESASTRE}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>¿Apadrinada?</label>
              <select
                value={formData.es_apadrinada}
                onChange={(e) => setFormData({...formData, es_apadrinada: e.target.value})}
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Familias;
