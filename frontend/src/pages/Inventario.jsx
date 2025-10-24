import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Layers } from 'lucide-react';
import articuloService from '../services/articuloService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import './Donadores.css';

const Inventario = () => {
  const [articulos, setArticulos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articulos'); // 'articulos' o 'lotes'
  const [showModal, setShowModal] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [articuloFormData, setArticuloFormData] = useState({
    nombre_articulo: '',
    categoria: '',
    unidad_medida: '',
    costo: ''
  });
  const [loteFormData, setLoteFormData] = useState({
    id_articulo: '',
    cantidad_inicial: '',
    fecha_vencimiento: '',
    origen: ''
  });

  useEffect(() => {
    loadArticulos();
    loadLotes();
  }, []);

  const loadArticulos = async () => {
    try {
      setLoading(true);
      const data = await articuloService.getAllArticulos();
      setArticulos(data);
      console.log('✅ Artículos cargados:', data.length);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      showToast('Error al cargar artículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadLotes = async () => {
    try {
    const data = await articuloService.getAllLotes();
      setLotes(data);
      console.log('✅ Lotes cargados:', data.length);
   } catch (error) {
      console.error('Error al cargar lotes:', error);
     showToast('Error al cargar lotes', 'error');
   }
  };

  const handleArticuloSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticulo) {
        await articuloService.updateArticulo(editingArticulo.ID_ARTICULO, articuloFormData);
        showToast('Artículo actualizado exitosamente', 'success');
      } else {
        await articuloService.createArticulo(articuloFormData);
        showToast('Artículo creado exitosamente', 'success');
      }
      closeModal();
      loadArticulos();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar artículo', 'error');
    }
  };

  const handleLoteSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📦 Creando lote:', loteFormData);
      await articuloService.createLote(loteFormData);
      showToast('Lote creado exitosamente', 'success');
      closeModal();
      await loadLotes(); // Esperar a que se recarguen
      console.log('✅ Lotes recargados');
    } catch (error) {
      console.error('❌ Error al crear lote:', error);
      showToast('Error al crear lote', 'error');
    }
  };

  const handleEditArticulo = (articulo) => {
    setEditingArticulo(articulo);
    setArticuloFormData({
      nombre_articulo: articulo.NOMBRE_ARTICULO || '',
      categoria: articulo.CATEGORIA || '',
      unidad_medida: articulo.UNIDAD_MEDIDA || '',
      costo: articulo.COSTO || ''
    });
    setActiveTab('articulos');
    setShowModal(true);
  };

  const handleDeleteArticulo = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este artículo?')) {
      try {
        await articuloService.deleteArticulo(id);
        showToast('Artículo eliminado exitosamente', 'success');
        loadArticulos();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar artículo', 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticulo(null);
    setArticuloFormData({
      nombre_articulo: '',
      categoria: '',
      unidad_medida: '',
      costo: ''
    });
    setLoteFormData({
      id_articulo: '',
      cantidad_inicial: '',
      fecha_vencimiento: '',
      origen: ''
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><Package size={32} /> Inventario</h1>
          <p>Gestión de artículos y lotes</p>
        </div>
        <button className="btn-primary" onClick={() => { setActiveTab(activeTab); setShowModal(true); }}>
          <Plus size={20} />
          {activeTab === 'articulos' ? 'Nuevo Artículo' : 'Nuevo Lote'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{marginBottom: '20px'}}>
        <button
          className={`tab-button ${activeTab === 'articulos' ? 'active' : ''}`}
          onClick={() => setActiveTab('articulos')}
        >
          <Package size={18} />
          Artículos
        </button>
        <button
          className={`tab-button ${activeTab === 'lotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('lotes')}
        >
          <Layers size={18} />
          Lotes
        </button>
      </div>

      {/* Tabla de Artículos */}
      {activeTab === 'articulos' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Unidad Medida</th>
                <th>Costo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center'}}>No hay artículos registrados</td>
                </tr>
              ) : (
                articulos.map((articulo) => (
                  <tr key={articulo.ID_ARTICULO}>
                    <td>{articulo.ID_ARTICULO}</td>
                    <td>{articulo.NOMBRE_ARTICULO}</td>
                    <td><span className="badge">{articulo.CATEGORIA}</span></td>
                    <td>{articulo.UNIDAD_MEDIDA}</td>
                    <td>{articulo.COSTO ? `Q${articulo.COSTO.toFixed(2)}` : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-edit" onClick={() => handleEditArticulo(articulo)} title="Editar">
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDeleteArticulo(articulo.ID_ARTICULO)} title="Eliminar">
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
      )}

      {/* Tabla de Lotes */}
      {activeTab === 'lotes' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Artículo</th>
                <th>Categoría</th>
                <th>Cantidad Inicial</th>
                <th>Disponible</th>
                <th>Fecha Entrada</th>
                <th>Vencimiento</th>
                <th>Origen</th>
              </tr>
            </thead>
            <tbody>
              {lotes.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center'}}>No hay lotes registrados</td>
                </tr>
              ) : (
                lotes.map((lote) => (
                  <tr key={lote.ID_LOTE}>
                    <td>{lote.ID_LOTE}</td>
                    <td>{lote.NOMBRE_ARTICULO}</td>
                    <td><span className="badge">{lote.CATEGORIA}</span></td>
                    <td>{lote.CANTIDAD_INICIAL}</td>
                    <td><strong>{lote.CANTIDAD_DISPONIBLE}</strong></td>
                    <td>{lote.FECHA_ENTRADA ? new Date(lote.FECHA_ENTRADA).toLocaleDateString() : '-'}</td>
                    <td>{lote.FECHA_VENCIMIENTO ? new Date(lote.FECHA_VENCIMIENTO).toLocaleDateString() : '-'}</td>
                    <td>{lote.ORIGEN || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer para Artículos */}
      {showModal && activeTab === 'articulos' && (
        <Drawer
          isOpen={showModal}
          onClose={closeModal}
          title={editingArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
          footer={
            <>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" form="articulo-form" className="btn-primary">
                {editingArticulo ? 'Actualizar' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="articulo-form" onSubmit={handleArticuloSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nombre del Artículo *</label>
                <input
                  type="text"
                  value={articuloFormData.nombre_articulo}
                  onChange={(e) => setArticuloFormData({...articuloFormData, nombre_articulo: e.target.value})}
                  required
                  placeholder="Ej: Arroz"
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={articuloFormData.categoria}
                  onChange={(e) => setArticuloFormData({...articuloFormData, categoria: e.target.value})}
                >
                  <option value="">Seleccione...</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Medicinas">Medicinas</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Construcción">Construcción</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unidad de Medida</label>
                <select
                  value={articuloFormData.unidad_medida}
                  onChange={(e) => setArticuloFormData({...articuloFormData, unidad_medida: e.target.value})}
                >
                  <option value="">Seleccione...</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Libra">Libra</option>
                  <option value="Kilogramo">Kilogramo</option>
                  <option value="Litro">Litro</option>
                  <option value="Caja">Caja</option>
                  <option value="Paquete">Paquete</option>
                </select>
              </div>

              <div className="form-group">
                <label>Costo Unitario</label>
                <input
                  type="number"
                  step="0.01"
                  value={articuloFormData.costo}
                  onChange={(e) => setArticuloFormData({...articuloFormData, costo: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
          </form>
        </Drawer>
      )}

      {/* Drawer para Lotes */}
      {showModal && activeTab === 'lotes' && (
        <Drawer
          isOpen={showModal}
          onClose={closeModal}
          title="Nuevo Lote"
          footer={
            <>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" form="lote-form" className="btn-primary">
                Guardar
              </button>
            </>
          }
        >
          <form id="lote-form" onSubmit={handleLoteSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Artículo *</label>
                <select
                  value={loteFormData.id_articulo}
                  onChange={(e) => setLoteFormData({...loteFormData, id_articulo: e.target.value})}
                  required
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.ID_ARTICULO} value={articulo.ID_ARTICULO}>
                      {articulo.NOMBRE_ARTICULO}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad Inicial *</label>
                <input
                  type="number"
                  value={loteFormData.cantidad_inicial}
                  onChange={(e) => setLoteFormData({...loteFormData, cantidad_inicial: e.target.value})}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={loteFormData.fecha_vencimiento}
                  onChange={(e) => setLoteFormData({...loteFormData, fecha_vencimiento: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Origen</label>
                <input
                  type="text"
                  value={loteFormData.origen}
                  onChange={(e) => setLoteFormData({...loteFormData, origen: e.target.value})}
                  placeholder="Ej: Donación, Compra"
                />
              </div>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
};

export default Inventario;
