import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Encabezado
  header: {
    marginBottom: 30,
    borderBottom: '3pt solid #2c3e50',
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 3,
  },
  // Número de certificado
  certificateNumber: {
    marginTop: 15,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
  },
  certificateNumberText: {
    fontSize: 11,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Secciones
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1pt solid #bdc3c7',
  },
  // Filas de información
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34495e',
    width: '40%',
  },
  value: {
    fontSize: 10,
    color: '#2c3e50',
    width: '60%',
  },
  // Tabla de análisis
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    padding: 8,
  },
  tableHeader: {
    backgroundColor: '#34495e',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    width: '50%',
  },
  tableCell: {
    fontSize: 10,
    color: '#2c3e50',
    width: '50%',
  },
  tableCellBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50',
    width: '50%',
  },
  // Balance
  balancePositive: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  balanceNegative: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  // Conclusión
  conclusionBox: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderLeft: '3pt solid #3498db',
    borderRadius: 3,
    marginTop: 5,
  },
  conclusionText: {
    fontSize: 10,
    color: '#2c3e50',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  // Recomendación
  recommendationBox: {
    padding: 12,
    backgroundColor: '#fff3cd',
    borderLeft: '3pt solid #ffc107',
    borderRadius: 3,
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 10,
    color: '#856404',
    lineHeight: 1.5,
  },
  // Firmas
  signaturesSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderTop: '1pt solid #2c3e50',
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 2,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  signatureRole: {
    fontSize: 8,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 2,
  },
  // Pie de página
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1pt solid #ecf0f1',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#95a5a6',
    textAlign: 'center',
  },
  // Sello de agua
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#ecf0f1',
    opacity: 0.1,
    fontWeight: 'bold',
  },
});

// Componente del documento PDF
const CertificadoPDF = ({ estudio }) => {
  const fechaEmision = new Date().toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fechaEstudio = estudio.FECHA_ESTUDIO
    ? new Date(estudio.FECHA_ESTUDIO).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  const balance = (estudio.INGRESOS_FAMILIARES || 0) - (estudio.GASTOS_FAMILIARES || 0);
  const calificaApadrinamiento = balance < 5000;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Marca de agua */}
        <Text style={styles.watermark}>CERTIFICADO</Text>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CERTIFICADO DE EVALUACIÓN</Text>
          <Text style={styles.headerSubtitle}>ESTUDIO SOCIOECONÓMICO</Text>
          <Text style={styles.headerSubtitle}>
            Sistema de Asistencia a Víctimas de Desastres Naturales
          </Text>
        </View>

        {/* Número de certificado */}
        <View style={styles.certificateNumber}>
          <Text style={styles.certificateNumberText}>
            CERTIFICADO N° {String(estudio.ID_ESTUDIO).padStart(6, '0')}
          </Text>
        </View>

        {/* Información de la Familia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. DATOS DE LA FAMILIA</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Jefe de Familia:</Text>
            <Text style={styles.value}>{estudio.JEFE_FAMILIA || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>{estudio.DIRECCION || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Municipio:</Text>
            <Text style={styles.value}>
              {estudio.MUNICIPIO}, {estudio.DEPARTAMENTO}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad de Miembros:</Text>
            <Text style={styles.value}>{estudio.CANTIDAD_MIEMBROS || 'N/A'} personas</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado de Apadrinamiento:</Text>
            <Text style={styles.value}>
              {estudio.ES_APADRINADA === 'Sí' ? 'Familia Apadrinada' : 'No Apadrinada'}
            </Text>
          </View>
        </View>

        {/* Análisis Económico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. ANÁLISIS ECONÓMICO</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableHeaderText}>Concepto</Text>
              <Text style={styles.tableHeaderText}>Monto (Q)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Ingresos Familiares Mensuales</Text>
              <Text style={styles.tableCell}>
                Q {(estudio.INGRESOS_FAMILIARES || 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Gastos Familiares Mensuales</Text>
              <Text style={styles.tableCell}>
                Q {(estudio.GASTOS_FAMILIARES || 0).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.tableCellBold}>Balance Mensual</Text>
              <Text style={[styles.tableCellBold, balance >= 0 ? styles.balancePositive : styles.balanceNegative]}>
                Q {balance.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.row} style={{ marginTop: 12 }}>
            <Text style={styles.label}>Fecha de Evaluación:</Text>
            <Text style={styles.value}>{fechaEstudio}</Text>
          </View>
        </View>

        {/* Conclusión */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. CONCLUSIÓN DEL ESTUDIO</Text>
          <View style={styles.conclusionBox}>
            <Text style={styles.conclusionText}>{estudio.CONCLUSION || 'Sin conclusión'}</Text>
          </View>

          {estudio.OBSERVACIONES && (
            <View style={styles.conclusionBox} style={{ marginTop: 10 }}>
              <Text style={styles.label}>Observaciones:</Text>
              <Text style={styles.conclusionText}>{estudio.OBSERVACIONES}</Text>
            </View>
          )}
        </View>

        {/* Recomendación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. RECOMENDACIÓN</Text>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              {calificaApadrinamiento
                ? `Con base en el análisis realizado, la familia presenta un balance mensual de Q${balance.toFixed(2)}, ` +
                  `lo cual es inferior al umbral de Q5,000.00 establecido. Por lo tanto, SE RECOMIENDA que la familia ` +
                  `sea considerada para el programa de apadrinamiento, con el fin de brindar apoyo económico y mejorar ` +
                  `su calidad de vida.`
                : `Con base en el análisis realizado, la familia presenta un balance mensual de Q${balance.toFixed(2)}, ` +
                  `lo cual es superior al umbral de Q5,000.00 establecido. La familia cuenta con recursos suficientes ` +
                  `para cubrir sus necesidades básicas, por lo que NO REQUIERE apadrinamiento en este momento.`}
            </Text>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.signaturesSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRMA DEL JEFE DE FAMILIA</Text>
            <Text style={styles.signatureName}>{estudio.JEFE_FAMILIA || 'N/A'}</Text>
            <Text style={styles.signatureRole}>Beneficiario</Text>
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRMA DEL EVALUADOR</Text>
            <Text style={styles.signatureName}>Sistema de Asistencia</Text>
            <Text style={styles.signatureRole}>Trabajador Social</Text>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Certificado emitido el {fechaEmision}
          </Text>
          <Text style={styles.footerText}>
            Este documento es válido únicamente con las firmas autorizadas
          </Text>
          <Text style={styles.footerText}>
            Sistema de Asistencia a Víctimas de Desastres Naturales - Guatemala
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Componente del botón de descarga
const BotonDescargaCertificado = ({ estudio }) => {
  return (
    <PDFDownloadLink
      document={<CertificadoPDF estudio={estudio} />}
      fileName={`Certificado_Estudio_${estudio.ID_ESTUDIO}_${estudio.JEFE_FAMILIA?.replace(/\s+/g, '_')}.pdf`}
      style={{
        textDecoration: 'none',
      }}
    >
      {({ loading }) => (
        <button
          className="btn-icon btn-download"
          title={loading ? 'Generando PDF...' : 'Descargar Certificado'}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#27ae60',
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
          {loading ? 'Generando...' : 'Certificado'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default BotonDescargaCertificado;
