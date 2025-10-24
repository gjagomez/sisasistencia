import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Bordes decorativos
  outerBorder: {
    border: '2pt solid #2c3e50',
    padding: 10,
    height: '100%',
  },
  innerBorder: {
    border: '1pt solid #95a5a6',
    padding: 15,
    height: '100%',
  },
  // Encabezado
  header: {
    marginBottom: 12,
    borderBottom: '2pt solid #3498db',
    paddingBottom: 8,
    textAlign: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: 5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 8,
    color: '#7f8c8d',
    marginTop: 1,
  },
  // Número de constancia
  constanciaNumber: {
    marginTop: 8,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#3498db',
    borderRadius: 3,
  },
  constanciaNumberText: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Texto principal
  mainText: {
    fontSize: 9,
    color: '#2c3e50',
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  // Información del beneficiario
  beneficiarioBox: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderLeft: '3pt solid #3498db',
    borderRadius: 2,
  },
  beneficiarioTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#34495e',
    width: '35%',
  },
  value: {
    fontSize: 8,
    color: '#2c3e50',
    width: '65%',
  },
  // Detalle de asistencia
  asistenciaBox: {
    marginVertical: 8,
    border: '2pt solid #27ae60',
    borderRadius: 3,
    overflow: 'hidden',
  },
  asistenciaHeader: {
    backgroundColor: '#27ae60',
    padding: 6,
  },
  asistenciaHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  asistenciaBody: {
    padding: 10,
    backgroundColor: '#f0fdf4',
  },
  asistenciaRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: '1pt solid #d1fae5',
  },
  asistenciaLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#166534',
    width: '40%',
  },
  asistenciaValue: {
    fontSize: 8,
    color: '#15803d',
    width: '60%',
  },
  valorTotal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#15803d',
  },
  // Observaciones
  observacionesBox: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#fff7ed',
    border: '1pt solid #fdba74',
    borderRadius: 2,
  },
  observacionesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9a3412',
    marginBottom: 3,
  },
  observacionesText: {
    fontSize: 7,
    color: '#7c2d12',
    lineHeight: 1.4,
  },
  // Sección de firmas
  firmasSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firmaBlock: {
    width: '45%',
  },
  firmaBox: {
    height: 40,
    borderBottom: '1.5pt solid #2c3e50',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  firmaPlaceholder: {
    fontSize: 6,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  firmaLabel: {
    fontSize: 7,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 2,
  },
  firmaNombre: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  firmaRole: {
    fontSize: 6,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 1,
  },
  // Pie de página
  footer: {
    position: 'absolute',
    bottom: 35,
    left: 40,
    right: 40,
    borderTop: '1pt solid #bdc3c7',
    paddingTop: 5,
  },
  footerText: {
    fontSize: 6,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 1,
  },
  // Sello
  sello: {
    position: 'absolute',
    top: 100,
    right: 60,
    width: 70,
    height: 70,
    border: '2pt solid #e74c3c',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'rotate(15deg)',
  },
  selloText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
  },
  // Marca de agua
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 50,
    color: '#ecf0f1',
    opacity: 0.1,
    fontWeight: 'bold',
  },
});

// Componente del documento PDF
const ConstanciaPDF = ({ asistencia }) => {
  const fechaEmision = new Date().toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaEntrega = asistencia.FECHA_ENTREGA
    ? new Date(asistencia.FECHA_ENTREGA).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : fechaEmision;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Marca de agua */}
        <Text style={styles.watermark}>CONSTANCIA</Text>

        {/* Bordes decorativos */}
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* Encabezado */}
            <View style={styles.header}>
              <Text style={styles.logoText}>⚕ SISTEMA DE ASISTENCIA ⚕</Text>
              <Text style={styles.headerTitle}>CONSTANCIA DE ASISTENCIA</Text>
              <Text style={styles.headerSubtitle}>
                A Víctimas de Desastres Naturales
              </Text>
              <Text style={styles.headerSubtitle}>República de Guatemala</Text>
            </View>

            {/* Número de constancia */}
            <View style={styles.constanciaNumber}>
              <Text style={styles.constanciaNumberText}>
                CONSTANCIA N° {String(asistencia.ID_ASISTENCIA).padStart(8, '0')}
              </Text>
            </View>

            {/* Sello decorativo */}
            <View style={styles.sello}>
              <Text style={styles.selloText}>ENTREGADO</Text>
              <Text style={[styles.selloText, { fontSize: 6, marginTop: 2 }]}>
                {new Date(asistencia.FECHA_ENTREGA || Date.now()).getFullYear()}
              </Text>
            </View>

            {/* Texto principal */}
            <Text style={styles.mainText}>
              Por medio de la presente, se hace constar que el{' '}
              <Text style={styles.highlight}>
                Sistema de Asistencia a Víctimas de Desastres Naturales
              </Text>{' '}
              ha brindado asistencia humanitaria a:
            </Text>

            {/* Información del beneficiario */}
            <View style={styles.beneficiarioBox}>
              <Text style={styles.beneficiarioTitle}>DATOS DEL BENEFICIARIO</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Jefe de Familia:</Text>
                <Text style={styles.value}>
                  {asistencia.JEFE_FAMILIA?.toUpperCase() || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fecha de Entrega:</Text>
                <Text style={styles.value}>{fechaEntrega}</Text>
              </View>
            </View>

            {/* Detalle de la asistencia */}
            <View style={styles.asistenciaBox}>
              <View style={styles.asistenciaHeader}>
                <Text style={styles.asistenciaHeaderText}>DETALLE DE LA ASISTENCIA</Text>
              </View>
              <View style={styles.asistenciaBody}>
                <View style={styles.asistenciaRow}>
                  <Text style={styles.asistenciaLabel}>Tipo de Asistencia:</Text>
                  <Text style={[styles.asistenciaValue, { fontWeight: 'bold' }]}>
                    {asistencia.TIPO_ASISTENCIA || 'N/A'}
                  </Text>
                </View>

                {asistencia.NOMBRE_ARTICULO && (
                  <View style={styles.asistenciaRow}>
                    <Text style={styles.asistenciaLabel}>Artículo Entregado:</Text>
                    <Text style={styles.asistenciaValue}>
                      {asistencia.NOMBRE_ARTICULO}
                    </Text>
                  </View>
                )}

                {asistencia.CANTIDAD_ENTREGADA && (
                  <View style={styles.asistenciaRow}>
                    <Text style={styles.asistenciaLabel}>Cantidad:</Text>
                    <Text style={styles.asistenciaValue}>
                      {asistencia.CANTIDAD_ENTREGADA} unidades
                    </Text>
                  </View>
                )}

                <View style={[styles.asistenciaRow, { borderBottom: 'none', marginTop: 5 }]}>
                  <Text style={styles.asistenciaLabel}>Valor Estimado:</Text>
                  <Text style={styles.valorTotal}>
                    Q {(asistencia.VALOR_ESTIMADO || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Observaciones */}
            {asistencia.OBSERVACIONES && (
              <View style={[styles.observacionesBox, { marginTop: 8, marginBottom: 8 }]}>
                <Text style={styles.observacionesTitle}>OBSERVACIONES:</Text>
                <Text style={styles.observacionesText}>{asistencia.OBSERVACIONES}</Text>
              </View>
            )}

            {/* Texto de validación */}
            <Text style={[styles.mainText, { marginTop: 10, fontSize: 8 }]}>
              Se extiende la presente constancia para los usos que el interesado considere
              convenientes, en la ciudad de Guatemala a los {fechaEmision}.
            </Text>

            {/* Firmas */}
            <View style={styles.firmasSection}>
              <View style={styles.firmaBlock}>
                <View style={styles.firmaBox}>
                  <Text style={styles.firmaPlaceholder}>(Firma del Beneficiario)</Text>
                </View>
                <Text style={styles.firmaLabel}>RECIBÍ CONFORME</Text>
                <Text style={styles.firmaNombre}>
                  {asistencia.JEFE_FAMILIA?.toUpperCase() || 'N/A'}
                </Text>
                <Text style={styles.firmaRole}>Jefe de Familia Beneficiaria</Text>
              </View>

              <View style={styles.firmaBlock}>
                <View style={styles.firmaBox}>
                  <Text style={styles.firmaPlaceholder}>(Firma y Sello)</Text>
                </View>
                <Text style={styles.firmaLabel}>ENTREGADO POR</Text>
                <Text style={styles.firmaNombre}>SISTEMA DE ASISTENCIA</Text>
                <Text style={styles.firmaRole}>Coordinador de Programas Sociales</Text>
              </View>
            </View>

            {/* Pie de página */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Este documento constituye constancia oficial de la asistencia brindada
              </Text>
              <Text style={styles.footerText}>
                Cualquier alteración invalida este documento
              </Text>
              <Text style={styles.footerText}>
                Sistema de Asistencia a Víctimas de Desastres Naturales - Guatemala
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Componente del botón de descarga
const BotonDescargaConstancia = ({ asistencia }) => {
  return (
    <PDFDownloadLink
      document={<ConstanciaPDF asistencia={asistencia} />}
      fileName={`Constancia_Asistencia_${asistencia.ID_ASISTENCIA}_${asistencia.JEFE_FAMILIA?.replace(/\s+/g, '_')}.pdf`}
      style={{
        textDecoration: 'none',
      }}
    >
      {({ loading }) => (
        <button
          className="btn-icon btn-download"
          title={loading ? 'Generando PDF...' : 'Descargar Constancia'}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Download size={16} />
          {loading ? 'Generando...' : 'Constancia'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default BotonDescargaConstancia;
