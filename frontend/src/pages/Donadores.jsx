import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import donadorService from '../services/donadorService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Donadores = () => {
  const [donadores, setDonadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDonador, setEditingDonador] = useState(null);
  const [formData, setFormData] = useState({
    tipo_donador: 'Persona',
    nombre: '',
    dpi: '',
    nit: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    loadDonadores();
  }, []);

  const loadDonadores = async () => {
    try {
      setLoading(true);
      const data = await donadorService.getAll();
      setDonadores(data);
    } catch (error) {
      console.error('Error al cargar donadores:', error);
      showToast('Error al cargar donadores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDonador) {
        await donadorService.update(editingDonador.ID_DONADOR, formData);
        showToast('Donador actualizado exitosamente', 'success');
      } else {
        await donadorService.create(formData);
        showToast('Donador creado exitosamente', 'success');
      }
      closeModal();
      loadDonadores();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar donador', 'error');
    }
  };

  const handleEdit = (donador) => {
    setEditingDonador(donador);
    setFormData({
      tipo_donador: donador.TIPO_DONADOR || 'Persona',
      nombre: donador.NOMBRE || '',
      dpi: donador.DPI || '',
      nit: donador.NIT || '',
      telefono: donador.TELEFONO || '',
      email: donador.EMAIL || '',
      direccion: donador.DIRECCION || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este donador?')) {
      try {
        await donadorService.delete(id);
        showToast('Donador eliminado exitosamente', 'success');
        loadDonadores();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar donador', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDonador(null);
    setFormData({
      tipo_donador: 'Persona',
      nombre: '',
      dpi: '',
      nit: '',
      telefono: '',
      email: '',
      direccion: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><Users size={32} /> Donadores</h1>
          <p>Gestión de donadores y benefactores</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Donador
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>DPI/NIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {donadores.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  No hay donadores registrados
                </td>
              </tr>
            ) : (
              donadores.map((donador) => (
                <tr key={donador.ID_DONADOR}>
                  <td>{donador.ID_DONADOR}</td>
                  <td>
                    <span className={`badge ${donador.TIPO_DONADOR === 'Empresa' ? 'badge-warning' : 'badge-success'}`}>
                      {donador.TIPO_DONADOR}
                    </span>
                  </td>
                  <td>{donador.NOMBRE}</td>
                  <td>{donador.DPI || donador.NIT}</td>
                  <td>{donador.TELEFONO}</td>
                  <td>{donador.EMAIL}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(donador)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(donador.ID_DONADOR)}
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
        title={editingDonador ? 'Editar Donador' : 'Nuevo Donador'}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" form="donador-form" className="btn-primary">
              {editingDonador ? 'Actualizar' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="donador-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Donador *</label>
              <select
                value={formData.tipo_donador}
                onChange={(e) => setFormData({ ...formData, tipo_donador: e.target.value })}
                required
              >
                <option value="Persona">Persona</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Nombre Completo / Razón Social *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                placeholder="Ingrese el nombre completo"
              />
            </div>

            <div className="form-group">
              <label>DPI</label>
              <input
                type="text"
                value={formData.dpi}
                onChange={(e) => setFormData({ ...formData, dpi: e.target.value })}
                placeholder="0000 00000 0000"
              />
            </div>

            <div className="form-group">
              <label>NIT</label>
              <input
                type="text"
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                placeholder="0000000-0"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="0000-0000"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                rows="3"
                placeholder="Ingrese la dirección completa"
              />
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default Donadores;
