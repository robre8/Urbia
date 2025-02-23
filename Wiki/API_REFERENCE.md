# 📡 Documentación de la API - Ciudad Escucha

Este documento detalla los endpoints disponibles en la API de "Ciudad Escucha". Como el MVP **no tendrá login**, se utilizará un usuario precargado en la base de datos para realizar las interacciones.

---

## 🌐 Base URL
```
https://api.ciudadescucha.com
```

---

## 📌 Endpoints Disponibles

### 🔹 **Obtener Reportes**
**GET /reports**
- **Descripción:** Obtiene todos los reportes registrados.
- **Respuesta:**
```json
[
  {
    "id": 1,
    "categoria": "Seguridad",
    "descripcion": "Robo en la calle principal",
    "imagen_url": "https://cdn.imagen.com/robo.jpg",
    "audio_url": "https://cdn.audio.com/robo.mp3",
    "ubicacion": { "lat": -34.6037, "lng": -58.3816 },
    "fecha": "2024-02-14T12:00:00Z"
  }
]
```

### 🔹 **Crear un Reporte**
**POST /reports**
- **Descripción:** Permite a un usuario enviar un nuevo reporte de incidente.
- **Body (JSON):**
```json
{
  "categoria": "Infraestructura",
  "descripcion": "Semáforo roto en Av. Libertador",
  "imagen": "(archivo adjunto)",
  "audio": "(archivo adjunto opcional)",
  "ubicacion": { "lat": -34.6037, "lng": -58.3816 }
}
```
- **Respuesta:**
```json
{
  "mensaje": "Reporte enviado correctamente",
  "id": 45
}
```

### 🔹 **Subir Archivo de Imagen o Audio**
**POST /upload**
- **Descripción:** Sube una imagen o archivo de audio y devuelve la URL.
- **Body (multipart/form-data):**
  - `file`: Archivo de imagen o audio.
- **Respuesta:**
```json
{
  "url": "https://cdn.imagen.com/archivo-subido.jpg"
}
```

### 🔹 **Notificaciones en Tiempo Real**
**GET /notifications**
- **Descripción:** Obtiene notificaciones recientes sobre reportes en la zona configurada.
- **Parámetros Opcionales:**
  - `radius` (int) → Radio en kilómetros para recibir alertas (Ej: `5` para 5km).
- **Respuesta:**
```json
[
  {
    "id": 12,
    "mensaje": "Accidente de tránsito en Av. Corrientes",
    "fecha": "2024-02-14T15:30:00Z"
  }
]
```

---

## 🛠 Consideraciones Técnicas
✅ **No se requiere autenticación**, ya que se usará un usuario precargado en la base de datos.  
✅ La API admite **CORS** para permitir solicitudes desde el frontend.  
✅ Los archivos subidos se almacenarán en **AWS S3 o Cloudflare R2**.  
✅ Se implementará **WebSockets o Polling** para notificaciones en tiempo real.  

---

🚀 **Este documento se actualizará conforme avance el desarrollo.**

