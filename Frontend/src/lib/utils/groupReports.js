export const groupReports = (reports) => {
  if (!Array.isArray(reports) || reports.length === 0) {
    console.warn("⚠️ No hay reportes para agrupar.");
    return {};
  }

  const grouped = {};
  reports.forEach((report) => {
    if (!report.latitud || !report.longitud) return; // Evita reportes sin coordenadas

    const key = `${report.latitud},${report.longitud}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(report);
  });

  console.log("✅ Reportes agrupados:", grouped);
  return grouped;
};
