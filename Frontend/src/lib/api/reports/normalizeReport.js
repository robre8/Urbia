const CATEGORY_NAME_TO_ID = {
  salud: 1,
  infraestructura: 2,
  seguridad: 3,
  'eventos sociales': 4,
};

const CATEGORY_ID_TO_NAME = {
  1: 'Salud',
  2: 'Infraestructura',
  3: 'Seguridad',
  4: 'Eventos Sociales',
};

export const normalizeReport = (rawReport) => {
  if (!rawReport || typeof rawReport !== 'object') return rawReport;

  const categoriaId = rawReport.categoriaId
    ?? (rawReport.category ? CATEGORY_NAME_TO_ID[String(rawReport.category).trim().toLowerCase()] : undefined);

  const titulo = rawReport.titulo ?? rawReport.title ?? '';
  const descripcionBase = rawReport.descripcionDespuesDeIa ?? rawReport.descripcion ?? rawReport.description ?? '';

  return {
    id: rawReport.id,
    titulo,
    descripcion: rawReport.descripcion ?? rawReport.description ?? descripcionBase,
    descripcionDespuesDeIa: descripcionBase,
    categoriaId,
    categoriaNombre: rawReport.categoriaNombre ?? rawReport.category ?? CATEGORY_ID_TO_NAME[categoriaId] ?? '',
    latitud: rawReport.latitud ?? rawReport.latitude ?? 0,
    longitud: rawReport.longitud ?? rawReport.longitude ?? 0,
    usuarioId: rawReport.usuarioId ?? rawReport.user_id,
    nombreUsuario: rawReport.nombreUsuario ?? '',
    urlImagen: rawReport.urlImagen ?? rawReport.image_url ?? '',
    estado: rawReport.estado ?? rawReport.status ?? 'pending',
    likes: rawReport.likes ?? rawReport.likes_count ?? 0,
    createdAt: rawReport.createdAt ?? rawReport.created_at ?? null,
    updatedAt: rawReport.updatedAt ?? rawReport.updated_at ?? null,
  };
};

export const normalizeReports = (reports) => {
  if (!Array.isArray(reports)) return [];
  return reports.map(normalizeReport);
};
