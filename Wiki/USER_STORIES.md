# 📌 User Stories - Ciudad Escucha

Este documento recopila todas las **User Stories** relacionadas con el desarrollo del MVP de "Ciudad Escucha". Estas historias de usuario definen las funcionalidades clave que debe cumplir el sistema.

---

## 📌 User Story: Notificaciones en Tiempo Real
**Como** ciudadano,  
**quiero** recibir notificaciones de incidentes en mi área,  
**para** estar informado sobre eventos que pueden afectarme.  

### 🎯 Criterios de Aceptación
✅ El usuario puede activar/desactivar notificaciones para cada categoría.  
✅ Se reciben alertas en tiempo real mediante WebSockets o polling.  
✅ Se pueden configurar preferencias sobre el radio de distancia de los incidentes (Ej: 1km, 5km).  

---

## 📌 User Story: Visualizar Reportes en el Mapa
**Como** ciudadano,  
**quiero** ver reportes de incidentes en el mapa organizados por categorías,  
**para** identificar situaciones de interés en mi área y actuar en consecuencia.  

### 🎯 Criterios de Aceptación
✅ El usuario puede ver reportes en el mapa diferenciados por categorías (colores/iconos distintos).  
✅ Al hacer clic en un marcador, se muestra el detalle del incidente con imagen, descripción y ubicación.  
✅ Se pueden aplicar filtros para visualizar solo una categoría (Ejemplo: solo reportes de salud).  
✅ El usuario puede ver reportes en tiempo real mediante WebSockets o polling.  

---

## 📌 User Story: Reportar un Incidente en la Ciudad
**Como** ciudadano,  
**quiero** poder reportar incidentes urbanos en distintas categorías,  
**para** alertar a la comunidad y a las autoridades sobre eventos que requieren atención.  

### 🎯 Criterios de Aceptación
✅ El usuario puede seleccionar una categoría de incidente antes de reportarlo.  
✅ Las categorías disponibles son Seguridad, Infraestructura, Salud y Eventos Comunitarios.  
✅ El usuario puede capturar y subir una foto.  
✅ El usuario puede grabar y subir un audio.  
✅ La IA analiza la imagen/audio y genera un resumen del incidente.  
✅ Se registra la ubicación automáticamente o se permite seleccionarla en el mapa.  
✅ Se muestra una confirmación cuando el reporte se ha enviado correctamente.  

---

🔗 Para más información, revisa la documentación en la carpeta `/docs/`. 🚀