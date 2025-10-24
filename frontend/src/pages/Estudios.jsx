import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, HandHeart, CheckCircle, AlertCircle, ArrowRight, Info } from 'lucide-react';
import estudioService from '../services/estudioService';
import familiaService from '../services/familiaService';
import donadorService from '../services/donadorService';
import apadrinamientoService from '../services/apadrinamientoService';
import Drawer from '../components/Drawer';
import { showToast } from '../components/ToastContainer';
import BotonDescargaCertificado from '../components/CertificadoEstudio';
import './Donadores.css';

const Estudios = () => {
  const [estudios, setEstudios] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [donadores, setDonadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEstudio, setEditingEstudio] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Estudio, 2: Apadrinamiento
  const [estudioCreado, setEstudioCreado] = useState(null);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id_familia: '',
    ingresos_familiares: '',
    gastos_familiares: '',
    conclusion: '',
    observaciones: ''
  });
  const [apadrinamientoData, setApadrinamientoData] = useState({
    id_donador: '',
    id_familia: '',
    estado: 'Activo'
  });

  useEffect(() => {
    loadEstudios();
    loadFamilias();
    loadDonadores();
  }, []);

  const loadEstudios = async () => {
    try {
      setLoading(true);
      const data = await estudioService.getAll();
      setEstudios(data);
    } catch (error) {
      console.error('Error al cargar estudios:', error);
      showToast('Error al cargar estudios', 'error');
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

  const loadDonadores = async () => {
    try {
      const data = await donadorService.getAll();
      setDonadores(data);
    } catch (error) {
      console.error('Error al cargar donadores:', error);
    }
  };

  const calcularBalance = () => {
    return parseFloat(formData.ingresos_familiares || 0) - parseFloat(formData.gastos_familiares || 0);
  };

  const familiaCalificaParaApadrinamiento = () => {
    const balance = calcularBalance();
    const familia = familias.find(f => f.ID_FAMILIA === parseInt(formData.id_familia));
    const yaEstaApadrinada = familia?.ES_APADRINADA === 'Sí';

    // Califica si el balance es menor a 5000 y no está apadrinada
    return balance < 5000 && !yaEstaApadrinada;
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!formData.id_familia || !formData.ingresos_familiares || !formData.gastos_familiares || !formData.conclusion) {
      showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    // Obtener información de la familia
    const familia = familias.find(f => f.ID_FAMILIA === parseInt(formData.id_familia));
    setFamiliaSeleccionada(familia);

    // Preparar datos de apadrinamiento
    setApadrinamientoData({
      ...apadrinamientoData,
      id_familia: formData.id_familia
    });

    // SIEMPRE pasar al paso 2 - NO guardar nada aquí
    console.log('➡️ Pasando al paso 2...');
    setCurrentStep(2);
  };

  const handleSaveEstudioOnly = async () => {
    try {
      await estudioService.create(formData);

      const familia = familias.find(f => f.ID_FAMILIA === parseInt(formData.id_familia));
      const yaEstaApadrinada = familia?.ES_APADRINADA === 'Sí';

      if (yaEstaApadrinada) {
        showToast('Estudio registrado exitosamente. La familia ya está apadrinada.', 'success', 5000);
      } else {
        showToast('Estudio registrado exitosamente. La familia tiene ingresos suficientes (balance ≥ Q5,000).', 'success', 5000);
      }

      closeModal();
      loadEstudios();
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('Error al guardar el estudio socioeconómico', 'error');
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // Validar padrino/madrina seleccionado
    if (!apadrinamientoData.id_donador) {
      showToast('Por favor seleccione un padrino/madrina', 'warning');
      return;
    }

    try {
      // 1. Guardar el estudio socioeconómico
      console.log('💾 Guardando estudio socioeconómico...');
      const nuevoEstudio = await estudioService.create(formData);
      console.log('✅ Estudio guardado:', nuevoEstudio);

      // 2. Guardar el apadrinamiento
      console.log('💾 Guardando apadrinamiento...');
      await apadrinamientoService.create(apadrinamientoData);
      console.log('✅ Apadrinamiento guardado');

      showToast('¡Estudio y apadrinamiento registrados exitosamente!', 'success', 5000);

      closeModal();
      loadEstudios();
      loadFamilias();
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      showToast('Error al guardar. Por favor intente nuevamente.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estudioService.update(editingEstudio.ID_ESTUDIO, formData);
      showToast('Estudio actualizado exitosamente', 'success');
      closeModal();
      loadEstudios();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al actualizar estudio', 'error');
    }
  };

  const handleEdit = (estudio) => {
    setEditingEstudio(estudio);
    setFormData({
      id_familia: estudio.ID_FAMILIA || '',
      ingresos_familiares: estudio.INGRESOS_FAMILIARES || '',
      gastos_familiares: estudio.GASTOS_FAMILIARES || '',
      conclusion: estudio.CONCLUSION || '',
      observaciones: estudio.OBSERVACIONES || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este estudio?')) {
      try {
        await estudioService.delete(id);
        showToast('Estudio eliminado exitosamente', 'success');
        loadEstudios();
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar estudio', 'error');
      }
    }
  };

  const skipApadrinamiento = async () => {
    // Guardar solo el estudio sin apadrinamiento
    try {
      await estudioService.create(formData);
      showToast('Estudio guardado. Puede apadrinar a la familia más tarde desde el módulo de Apadrinamientos.', 'info', 5000);
      closeModal();
      loadEstudios();
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar el estudio', 'error');
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEstudio(null);
    setCurrentStep(1);
    setEstudioCreado(null);
    setFamiliaSeleccionada(null);
    setFormData({
      id_familia: '',
      ingresos_familiares: '',
      gastos_familiares: '',
      conclusion: '',
      observaciones: ''
    });
    setApadrinamientoData({
      id_donador: '',
      id_familia: '',
      estado: 'Activo'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando estudios...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><FileText size={32} /> Estudios Socioeconómicos</h1>
          <p>Análisis de la situación económica de las familias</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Nuevo Estudio
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Familia</th>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Gastos</th>
              <th>Balance</th>
              <th>Conclusión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudios.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center'}}>No hay estudios registrados</td>
              </tr>
            ) : (
              estudios.map((estudio) => {
                const balance = (estudio.INGRESOS_FAMILIARES || 0) - (estudio.GASTOS_FAMILIARES || 0);
                return (
                  <tr key={estudio.ID_ESTUDIO}>
                    <td>{estudio.ID_ESTUDIO}</td>
                    <td>{estudio.JEFE_FAMILIA}</td>
                    <td>{estudio.FECHA_ESTUDIO ? new Date(estudio.FECHA_ESTUDIO).toLocaleDateString() : '-'}</td>
                    <td>Q{estudio.INGRESOS_FAMILIARES?.toFixed(2) || '0.00'}</td>
                    <td>Q{estudio.GASTOS_FAMILIARES?.toFixed(2) || '0.00'}</td>
                    <td style={{color: balance >= 0 ? '#27ae60' : '#e74c3c'}}>
                      <strong>Q{balance.toFixed(2)}</strong>
                    </td>
                    <td>{estudio.CONCLUSION?.substring(0, 30)}{estudio.CONCLUSION?.length > 30 ? '...' : ''}</td>
                    <td>
                      <div className="action-buttons" style={{ gap: '8px' }}>
                        <BotonDescargaCertificado estudio={estudio} />
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(estudio)} title="Editar">
                          <Edit size={16} />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(estudio.ID_ESTUDIO)} title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={showModal}
        onClose={closeModal}
        size="large"
        preventClose={currentStep === 2 && !editingEstudio}
        title={
          editingEstudio
            ? 'Editar Estudio Socioeconómico'
            : currentStep === 1
              ? 'Estudio Socioeconómico - Evaluación de Familia'
              : 'Apadrinamiento de Familia - Asignar Padrino/Madrina'
        }
        footer={
          editingEstudio ? (
            <>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" form="estudio-form" className="btn-primary">
                Actualizar Estudio
              </button>
            </>
          ) : currentStep === 1 ? (
            <>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" form="estudio-form" className="btn-primary">
                Siguiente
                <ArrowRight size={18} style={{marginLeft: '8px'}} />
              </button>
            </>
          ) : (
            <>
              {familiaCalificaParaApadrinamiento() ? (
                <>
                  <button type="button" className="btn-secondary" onClick={skipApadrinamiento}>
                    Omitir Apadrinamiento
                  </button>
                  <button type="submit" form="apadrinamiento-form" className="btn-primary">
                    <HandHeart size={18} style={{marginRight: '8px'}} />
                    Guardar Todo
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="button" className="btn-primary" onClick={handleSaveEstudioOnly}>
                    Guardar Estudio
                  </button>
                </>
              )}
            </>
          )
        }
      >
        {/* Indicador de pasos mejorado */}
        {!editingEstudio && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '12px',
            border: '1px solid #e1e8ed'
          }}>
            {/* Paso 1 */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              borderRadius: '10px',
              backgroundColor: currentStep === 1 ? '#3498db' : '#27ae60',
              color: 'white',
              boxShadow: currentStep === 1 ? '0 4px 12px rgba(52, 152, 219, 0.4)' : '0 2px 8px rgba(39, 174, 96, 0.3)',
              transition: 'all 0.3s ease',
              transform: currentStep === 1 ? 'scale(1.02)' : 'scale(1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {currentStep === 1 ? '1' : <CheckCircle size={24} />}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '2px'}}>
                  {currentStep === 1 ? 'En Proceso' : 'Completado'}
                </div>
                <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                  Estudio Socioeconómico
                </div>
              </div>
              <FileText size={24} />
            </div>

            {/* Flecha separadora */}
            <ArrowRight size={28} style={{color: '#94a3b8', flexShrink: 0}} />

            {/* Paso 2 */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              borderRadius: '10px',
              backgroundColor: currentStep === 2 ? '#3498db' : '#e2e8f0',
              color: currentStep === 2 ? 'white' : '#64748b',
              boxShadow: currentStep === 2 ? '0 4px 12px rgba(52, 152, 219, 0.4)' : 'none',
              transition: 'all 0.3s ease',
              transform: currentStep === 2 ? 'scale(1.02)' : 'scale(1)',
              border: currentStep === 2 ? 'none' : '2px dashed #cbd5e1'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep === 2 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(203, 213, 225, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                2
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '2px'}}>
                  {currentStep === 2 ? 'En Proceso' : 'Pendiente'}
                </div>
                <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                  Apadrinamiento
                </div>
              </div>
              <HandHeart size={24} />
            </div>
          </div>
        )}

        {/* Paso 1: Formulario de Estudio */}
        {currentStep === 1 && (
          <form id="estudio-form" onSubmit={editingEstudio ? handleSubmit : handleNextStep}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Familia *</label>
                <select
                  value={formData.id_familia}
                  onChange={(e) => setFormData({...formData, id_familia: e.target.value})}
                  required
                >
                  <option value="">Seleccione una familia</option>
                  {familias.map(familia => (
                    <option key={familia.ID_FAMILIA} value={familia.ID_FAMILIA}>
                      {familia.JEFE_FAMILIA} - {familia.MUNICIPIO} ({familia.CANTIDAD_MIEMBROS} miembros)
                      {familia.ES_APADRINADA === 'Sí' ? ' [Ya apadrinada]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ingresos Familiares Mensuales (Q) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ingresos_familiares}
                  onChange={(e) => setFormData({...formData, ingresos_familiares: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gastos Familiares Mensuales (Q) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gastos_familiares}
                  onChange={(e) => setFormData({...formData, gastos_familiares: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Conclusión *</label>
                <textarea
                  value={formData.conclusion}
                  onChange={(e) => setFormData({...formData, conclusion: e.target.value})}
                  placeholder="Conclusión del estudio socioeconómico"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group full-width">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Observaciones adicionales"
                  rows="3"
                ></textarea>
              </div>

              {formData.ingresos_familiares && formData.gastos_familiares && (
                <div className="form-group full-width">
                  <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    background: calcularBalance() < 5000
                      ? 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)'
                      : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: '2px solid ' + (calcularBalance() < 5000 ? '#f87171' : '#4ade80'),
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                      {calcularBalance() < 5000 ? (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#fee2e2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <AlertCircle size={28} color="#dc2626" />
                        </div>
                      ) : (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#d1fae5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircle size={28} color="#16a34a" />
                        </div>
                      )}
                      <div style={{flex: 1}}>
                        <p style={{margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                          Balance Mensual Calculado
                        </p>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: calcularBalance() < 5000 ? '#dc2626' : '#16a34a',
                          lineHeight: 1
                        }}>
                          Q{calcularBalance().toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid ' + (calcularBalance() < 5000 ? '#fecaca' : '#bbf7d0')
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                        {calcularBalance() < 5000 ? (
                          <HandHeart size={20} color="#dc2626" />
                        ) : (
                          <CheckCircle size={20} color="#16a34a" />
                        )}
                        <p style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: 'bold',
                          color: calcularBalance() < 5000 ? '#dc2626' : '#16a34a'
                        }}>
                          {calcularBalance() < 5000
                            ? '⚠️ Familia Califica para Apadrinamiento'
                            : '✓ Familia con Ingresos Suficientes'}
                        </p>
                      </div>
                      <p style={{
                        margin: '4px 0 0 0',
                        fontSize: '13px',
                        color: '#6b7280',
                        lineHeight: 1.5
                      }}>
                        {calcularBalance() < 5000
                          ? `La familia tiene un balance menor a Q5,000 mensuales. ${familiaCalificaParaApadrinamiento() ? 'Podrá continuar al paso de apadrinamiento.' : 'Sin embargo, ya está apadrinada.'}`
                          : 'La familia cuenta con ingresos suficientes para cubrir sus necesidades básicas.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Paso 2: Apadrinamiento o Confirmación */}
        {currentStep === 2 && (
          <>
            {familiaCalificaParaApadrinamiento() ? (
              // CALIFICA - Mostrar formulario de apadrinamiento
              <>
            {/* Resumen del Estudio Mejorado */}
            <div style={{
              padding: '24px',
              marginBottom: '28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #fbbf24',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fbbf24'
                }}>
                  <HandHeart size={24} color="#d97706" />
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{margin: 0, color: '#92400e', fontSize: '20px', fontWeight: 'bold'}}>
                    Familia que Necesita Apoyo
                  </h3>
                  <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#78716c'}}>
                    Revise los datos antes de guardar el estudio y apadrinamiento
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div>
                  <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Jefe de Familia
                  </p>
                  <p style={{margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600'}}>
                    {familiaSeleccionada?.JEFE_FAMILIA}
                  </p>
                </div>

                <div>
                  <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Miembros
                  </p>
                  <p style={{margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600'}}>
                    {familiaSeleccionada?.CANTIDAD_MIEMBROS} personas
                  </p>
                </div>

                <div>
                  <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Ubicación
                  </p>
                  <p style={{margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600'}}>
                    {familiaSeleccionada?.MUNICIPIO}, {familiaSeleccionada?.DEPARTAMENTO}
                  </p>
                </div>

                <div>
                  <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Balance Mensual
                  </p>
                  <p style={{margin: 0, fontSize: '20px', color: '#dc2626', fontWeight: 'bold'}}>
                    Q{calcularBalance().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <form id="apadrinamiento-form" onSubmit={handleFinalSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label style={{fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'block'}}>
                    Seleccionar Padrino/Madrina *
                  </label>
                  <select
                    value={apadrinamientoData.id_donador}
                    onChange={(e) => setApadrinamientoData({...apadrinamientoData, id_donador: e.target.value})}
                    required
                    style={{fontSize: '15px', padding: '12px'}}
                  >
                    <option value="">Seleccione un donador</option>
                    {donadores.map(donador => (
                      <option key={donador.ID_DONADOR} value={donador.ID_DONADOR}>
                        {donador.NOMBRE} - {donador.CORREO}
                      </option>
                    ))}
                  </select>
                  <small style={{color: '#6b7280', marginTop: '8px', display: 'block', fontSize: '13px'}}>
                    El donador seleccionado será asignado como padrino/madrina de esta familia
                  </small>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: '2px solid #60a5fa',
                  borderRadius: '10px',
                  marginTop: '16px'
                }}>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Info size={22} color="#2563eb" />
                    </div>
                    <div>
                      <p style={{margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e40af'}}>
                        Compromiso de Apadrinamiento
                      </p>
                      <p style={{margin: 0, fontSize: '14px', color: '#1e40af', lineHeight: 1.6}}>
                        Al apadrinar esta familia, el padrino/madrina se compromete a brindar apoyo continuo y sostenido a la familia en situación de vulnerabilidad, contribuyendo a mejorar su calidad de vida.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            </>
            ) : (
              // NO CALIFICA - Mostrar mensaje
              <>
                <div style={{
                  padding: '24px',
                  marginBottom: '28px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: '2px solid #60a5fa',
                  boxShadow: '0 4px 12px rgba(96, 165, 250, 0.2)'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #60a5fa'
                    }}>
                      <CheckCircle size={24} color="#2563eb" />
                    </div>
                    <div style={{flex: 1}}>
                      <h3 style={{margin: 0, color: '#1e40af', fontSize: '20px', fontWeight: 'bold'}}>
                        Familia con Ingresos Suficientes
                      </h3>
                      <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#3b82f6'}}>
                        El estudio será guardado sin apadrinamiento
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                  }}>
                    <div>
                      <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                        Jefe de Familia
                      </p>
                      <p style={{margin: 0, fontSize: '16px', color: '#1f2937', fontWeight: '600'}}>
                        {familiaSeleccionada?.JEFE_FAMILIA}
                      </p>
                    </div>

                    <div>
                      <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                        Balance Mensual
                      </p>
                      <p style={{margin: 0, fontSize: '20px', color: '#16a34a', fontWeight: 'bold'}}>
                        Q{calcularBalance().toFixed(2)}
                      </p>
                    </div>

                    <div style={{gridColumn: '1 / -1'}}>
                      <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#78716c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                        Razón
                      </p>
                      <p style={{margin: 0, fontSize: '15px', color: '#1f2937', lineHeight: 1.5}}>
                        {familiaSeleccionada?.ES_APADRINADA === 'Sí'
                          ? '✓ La familia ya cuenta con un apadrinamiento activo.'
                          : `✓ La familia tiene un balance mensual de Q${calcularBalance().toFixed(2)}, suficiente para cubrir sus necesidades básicas (≥ Q5,000).`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px'
                }}>
                  <p style={{margin: 0, fontSize: '14px', color: '#0c4a6e', lineHeight: 1.6}}>
                    <strong>ℹ Información:</strong> El estudio socioeconómico será guardado en el sistema. Si en el futuro la situación económica de la familia cambia, puede crear un nuevo estudio y evaluar si califica para apadrinamiento.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Estudios;
