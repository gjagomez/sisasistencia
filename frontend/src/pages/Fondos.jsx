import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import fondoService from '../services/fondoService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Fondos = () => {
  const [fondos, setFondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [editingFondo, setEditingFondo] = useState(null);
  const [selectedFondo, setSelectedFondo] = useState(null);
  const [formData, setFormData] = useState({
    nombre_fondo: '',
    saldo: '',
    descripcion: ''
  });
  const [saldoData, setSaldoData] = useState({
    monto: '',
    operacion: 'incrementar'
  });

  useEffect(() => {
    loadFondos();
  }, []);

  const loadFondos = async () => {
    try {
      setLoading(true);
      const data = await fondoService.getAll();
      setFondos(data);
    } catch (error) {
      console.error('Error al cargar fondos:', error);
      showToast('Error al cargar fondos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFondo) {
        await fondoService.update(editingFondo.ID_FONDO, formData);
        showToast('Fondo actualizado exitosamente', 'success');
      } else {
        await fondoService.create(formData);
        showToast('Fondo creado exitosamente', 'success');
      }
      closeModal();
      loadFondos();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar fondo', 'error');
    }
  };

  const handleSaldoSubmit = async (e) => {
    e.preventDefault();
    try {
      await fondoService.updateSaldo(selectedFondo.ID_FONDO, saldoData.monto, saldoData.operacion);
      showToast('Saldo actualizado exitosamente', 'success');
      closeSaldoModal();
      loadFondos();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al actualizar saldo', 'error');
    }
  };

  const handleEdit = (fondo) => {
    setEditingFondo(fondo);
    setFormData({
      nombre_fondo: fondo.NOMBRE_FONDO || '',
      saldo: fondo.SALDO || '',
      descripcion: fondo.DESCRIPCION || ''
    });
    setShowModal(true);
  };

  const handleModificarSaldo = (fondo) => {
    setSelectedFondo(fondo);
    setSaldoData({
      monto: '',
      operacion: 'incrementar'
    });
    setShowSaldoModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este fondo?')) {
      try {
        await fondoService.delete(id);
        showToast('Fondo eliminado exitosamente', 'success');
        loadFondos();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar fondo', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFondo(null);
    setFormData({
      nombre_fondo: '',
      saldo: '',
      descripcion: ''
    });
  };

  const closeSaldoModal = () => {
    setShowSaldoModal(false);
    setSelectedFondo(null);
    setSaldoData({
      monto: '',
      operacion: 'incrementar'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando fondos...</p>
      </div>
    );
  }

  const totalSaldo = fondos.reduce((sum, fondo) => sum + (fondo.SALDO || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><Wallet size={32} /> Fondos</h1>
          <p>Gestión de fondos y recursos financieros</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Fondo
        </button>
      </div>

      <div className="stats-summary" style={{marginBottom: '20px'}}>
        <div className="stat-card">
          <h3>Saldo Total</h3>
          <p className="stat-value">Q{totalSaldo.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Fondos</h3>
          <p className="stat-value">{fondos.length}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Fondo</th>
              <th>Saldo</th>
              <th>Última Actualización</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fondos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No hay fondos registrados</td>
              </tr>
            ) : (
              fondos.map((fondo) => (
                <tr key={fondo.ID_FONDO}>
                  <td>{fondo.ID_FONDO}</td>
                  <td>{fondo.NOMBRE_FONDO}</td>
                  <td><strong>Q{fondo.SALDO?.toFixed(2)}</strong></td>
                  <td>{fondo.ULTIMA_ACTUALIZACION ? new Date(fondo.ULTIMA_ACTUALIZACION).toLocaleString() : '-'}</td>
                  <td>{fondo.DESCRIPCION || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-success" onClick={() => handleModificarSaldo(fondo)} title="Modificar Saldo">
                        <Wallet size={16} />
                      </button>
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(fondo)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(fondo.ID_FONDO)} title="Eliminar">
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

      {/* Drawer para crear/editar fondo */}
      {showModal && (
        <Drawer
          isOpen={showModal}
          onClose={closeModal}
          title={editingFondo ? 'Editar Fondo' : 'Nuevo Fondo'}
          footer={
            <>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" form="fondo-form" className="btn-primary">
                {editingFondo ? 'Actualizar' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="fondo-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nombre del Fondo *</label>
                <input
                  type="text"
                  value={formData.nombre_fondo}
                  onChange={(e) => setFormData({...formData, nombre_fondo: e.target.value})}
                  required
                  placeholder="Ej: Fondo de Emergencias"
                />
              </div>

              <div className="form-group">
                <label>Saldo Inicial</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.saldo}
                  onChange={(e) => setFormData({...formData, saldo: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción del fondo"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </form>
        </Drawer>
      )}

      {/* Drawer para modificar saldo */}
      {showSaldoModal && selectedFondo && (
        <Drawer
          isOpen={showSaldoModal}
          onClose={closeSaldoModal}
          title={`Modificar Saldo - ${selectedFondo.NOMBRE_FONDO}`}
          footer={
            <>
              <button type="button" className="btn-secondary" onClick={closeSaldoModal}>
                Cancelar
              </button>
              <button type="submit" form="saldo-form" className="btn-primary">
                Actualizar Saldo
              </button>
            </>
          }
        >
          <form id="saldo-form" onSubmit={handleSaldoSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <p>Saldo actual: <strong>Q{selectedFondo.SALDO?.toFixed(2)}</strong></p>
              </div>

              <div className="form-group">
                <label>Operación *</label>
                <select
                  value={saldoData.operacion}
                  onChange={(e) => setSaldoData({...saldoData, operacion: e.target.value})}
                  required
                >
                  <option value="incrementar">
                    <TrendingUp size={16} /> Incrementar (Ingreso)
                  </option>
                  <option value="decrementar">
                    <TrendingDown size={16} /> Decrementar (Egreso)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  value={saldoData.monto}
                  onChange={(e) => setSaldoData({...saldoData, monto: e.target.value})}
                  required
                  min="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
};

export default Fondos;
