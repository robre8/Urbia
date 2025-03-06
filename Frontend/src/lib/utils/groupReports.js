export const groupReports = (reports) => {
  if (!Array.isArray(reports) || reports.length === 0) {
    console.warn("⚠️ No hay reportes para agrupar.");
    return {};
  }

  const n = reports.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  
  const find = (i) => {
    if (parent[i] !== i) parent[i] = find(parent[i]);
    return parent[i];
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) parent[rootJ] = rootI;
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // radio de la Tierra en metros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  for (let i = 0; i < n; i++) {
    if (!reports[i].latitud || !reports[i].longitud) continue;
    for (let j = i + 1; j < n; j++) {
      if (!reports[j].latitud || !reports[j].longitud) continue;
      if (
        haversineDistance(
          reports[i].latitud,
          reports[i].longitud,
          reports[j].latitud,
          reports[j].longitud
        ) <= 50
      ) {
        union(i, j);
      }
    }
  }

  const groups = {};
  for (let i = 0; i < n; i++) {
    if (!reports[i].latitud || !reports[i].longitud) continue;
    const root = find(i);
    if (!groups[root]) groups[root] = [];
    groups[root].push(reports[i]);
  }

  console.log("✅ Reportes agrupados:", groups);
  return groups;
};
