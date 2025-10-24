import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import beneficiadoService from '../services/beneficiadoService';
import familiaService from '../services/familiaService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Beneficiados = () => {
  const [beneficiados, setBeneficiados] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBeneficiado, setEditingBeneficiado] = useState(null);
  const [formData, setFormData] = useState({
    id_familia: '',
    nombre: '',
    apellido: '',
    dpi: '',
    fecha_nacimiento: '',
    parentesco: ''
  });

  useEffect(() => {
    loadBeneficiados();
    loadFamilias();
  }, []);

  const loadBeneficiados = async () => {
    try {
      setLoading(true);
      const data = await beneficiadoService.getAll();
      setBeneficiados(data);
    } catch (error) {
      console.error('Error al cargar beneficiados:', error);
      showToast('Error al cargar beneficiados', 'error');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBeneficiado) {
        await beneficiadoService.update(editingBeneficiado.ID_BENEFICIADO, formData);
        showToast('Beneficiado actualizado exitosamente', 'success');
      } else {
        await beneficiadoService.create(formData);
        showToast('Beneficiado registrado exitosamente', 'success');
      }
      closeModal();
      loadBeneficiados();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar beneficiado', 'error');
    }
  };

  const handleEdit = (beneficiado) => {
    setEditingBeneficiado(beneficiado);
    setFormData({
      id_familia: beneficiado.ID_FAMILIA || '',
      nombre: beneficiado.NOMBRE || '',
      apellido: beneficiado.APELLIDO || '',
      dpi: beneficiado.DPI || '',
      fecha_nacimiento: beneficiado.FECHA_NACIMIENTO ? beneficiado.FECHA_NACIMIENTO.split('T')[0] : '',
      parentesco: beneficiado.PARENTESCO || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este beneficiado?')) {
      try {
        await beneficiadoService.delete(id);
        showToast('Beneficiado eliminado exitosamente', 'success');
        loadBeneficiados();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar beneficiado', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBeneficiado(null);
    setFormData({
      id_familia: '',
      nombre: '',
      apellido: '',
      dpi: '',
      fecha_nacimiento: '',
      parentesco: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando beneficiados...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><User size={32} /> Beneficiados</h1>
          <p>Gestión de miembros de las familias beneficiadas</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Beneficiado
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>DPI</th>
              <th>Fecha Nacimiento</th>
              <th>Parentesco</th>
              <th>Familia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {beneficiados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: 'center'}}>No hay beneficiados registrados</td>
              </tr>
            ) : (
              beneficiados.map((beneficiado) => (
                <tr key={beneficiado.ID_BENEFICIADO}>
                  <td>{beneficiado.ID_BENEFICIADO}</td>
                  <td>{beneficiado.NOMBRE} {beneficiado.APELLIDO}</td>
                  <td>{beneficiado.DPI || '-'}</td>
                  <td>{beneficiado.FECHA_NACIMIENTO ? new Date(beneficiado.FECHA_NACIMIENTO).toLocaleDateString() : '-'}</td>
                  <td>{beneficiado.PARENTESCO || '-'}</td>
                  <td>{beneficiado.JEFE_FAMILIA || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(beneficiado)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(beneficiado.ID_BENEFICIADO)} title="Eliminar">
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
        title={editingBeneficiado ? 'Editar Beneficiado' : 'Nuevo Beneficiado'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="beneficiado-form" className="btn-primary">
              {editingBeneficiado ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="beneficiado-form" onSubmit={handleSubmit}>
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
                    {familia.JEFE_FAMILIA}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Parentesco</label>
              <select
                value={formData.parentesco}
                onChange={(e) => setFormData({...formData, parentesco: e.target.value})}
              >
                <option value="">Seleccione...</option>
                <option value="Jefe de Familia">Jefe de Familia</option>
                <option value="Esposo/a">Esposo/a</option>
                <option value="Hijo/a">Hijo/a</option>
                <option value="Padre/Madre">Padre/Madre</option>
                <option value="Hermano/a">Hermano/a</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
                placeholder="Nombre"
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                placeholder="Apellido"
              />
            </div>

            <div className="form-group">
              <label>DPI</label>
              <input
                type="text"
                value={formData.dpi}
                onChange={(e) => setFormData({...formData, dpi: e.target.value})}
                placeholder="0000 00000 0000"
                maxLength="20"
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
              />
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Beneficiados;
