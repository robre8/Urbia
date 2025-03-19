# 📅 Planificación del MVP - "Urbia" 🚀  

## 📌 Sprints y Objetivos  
| Sprint | Enfoque | Objetivo | Tareas Clave | Prioridad |
|---------|------------|----------------------------------------|----------------------------------------|------------|
| **Sprint 0** ✅ | 🔧 **Configuración Inicial del equipo y herramientas.** |  Establecer la infraestructura del proyecto, definir lineamientos de trabajo y desarrollar la base del backend y frontend. | Configuración de repos, CI/CD, estructura del monorepo, integración de mapas y autenticación básica. | **P0** |
| **Sprint 1** ✅ | 📌 **Creación de reportes con multimedia y geolocalización.** | Permitir a los usuarios crear reportes con ubicación, imágenes y audio. | Implementar reportes con imagen/audio y vista en mapa con filtros. **Se comienza a implementar UI en código**. | **P1** |
| **Sprint 2** ✅ | 🔔 **Visualización de reportes y notificaciones en tiempo real.** | Mostrar los reportes en el mapa y permitir notificaciones en tiempo real. | Agregar WebSockets/Polling, optimizar UI/UX y pruebas de integración. | **P1/P2** |
| **Sprint 3** ✅ | 🚀 **Interacción y moderación de reportes. Análisis de reportes con IA** | Permitir que los usuarios interactúen con los reportes y análisis de reportes con inteligencia artificial. | QA Manual, pruebas finales, mejoras de rendimiento y ajustes UI/UX. | **P1/P2** |
| **Sprint 4** ✅ | 🏁 **Autenticación / Entrega Final** | Implementar autenticación | Presentación, documentación y despliegue definitivo. | **P2** |

---

## 🎨 UX/UI Roadmap (Corre en paralelo al desarrollo)  
| Semana | Entregables UX/UI |
|---------|--------------------------------|
| **Sprint 1** | Prototipo en Figma con flujo de usuario detallado **y primeras implementaciones en código**. |
| **Sprint 2** | Avance de UI en código, revisión con el equipo y ajustes iterativos. |
| **Sprint 3** | Refinamiento UI, integración con funcionalidades backend y mejoras de experiencia de usuario. |
| **Sprint 4** | Ajustes finales basados en testing y accesibilidad. |

---

## 🛠 Consideraciones Técnicas  
- **Frontend:** React + Zustand + TailwindCSS + ShadCN.  
- **Backend:** Java Spring Boot + PostgreSQL + API de IA (Gemini/DeepSeek).  
- **Tiempo real:** WebSockets o polling cada 60s.  
- **Almacenamiento de imágenes:** AWS S3 (Free Tier) o Cloudflare R2.  
- **Mapa interactivo:** OpenStreetMap u otra API gratuita.  

---

## 📌 Priorización y Estimación  
| User Story | Prioridad | Estimación (días) | Responsable |
|------------|-----------|-------------------|-------------|
| **Reportar un incidente (con categorías)** | 🟥 P1 | 5 días | Frontend + Backend + IA |
| **Visualizar reportes en el mapa (con filtros por categoría)** | 🟥 P1 | 5 días | Frontend + Backend |
| **Notificaciones en tiempo real** | 🟧 P2 | 5 días | Frontend + Backend |

⏳ **Total estimado para MVP:** **3 sprints de desarrollo activos, antes del Sprint 4 de entrega.**

---

## 📌 Primeras Tareas en GitHub Projects  
### 🔹 **Sprint 0 - Configuración Inicial del equipo y herramientas (Completado) ✅**  
- [x] Configurar repositorios en GitHub  
- [x] Configurar CI/CD con GitHub Actions y Railway/Vercel  
- [x] Crear estructura del monorepo  
- [x] Definir estándares de commits y convenciones de PR  
- [x] Integrar OpenStreetMap en el frontend  
- [x] Configurar autenticación básica en backend  


### 🔹 **Sprint 1 - Creación de reportes con multimedia y geolocalización (Completado) ✅**  
#### Backend (2 Devs)
- [x] [BACKEND] - Crear Proyecto Backend
- [x] [BACKEND] - Crear base de datos MySQL o PostgreSQL
- [x] [BACKEND] - Crear base de datos en Amazon S3
- [x] [BACKEND] - Integrar websockets con librería de SpringBoot
- [x] [BACKEND] - Crear estructura monolítica MVC
- [x] [BACKEND] - Deploy API
- [x] [BACKEND] - Imagen Docker
- [x] [BACKEND] - [HU3]: Desarrollar ENDPOINT - Crear reporte ciudadano
- [x] [BACKEND] - [HU5]: Desarrollar ENDPOINT - Consultar lista de reportes creados
- [x] [BACKEND] - [HU11]: Desarrollar ENDPOINT - Ver un reporte
- [x] [BACKEND] - [HU12]: Desarrollar ENDPOINT - Modificar un reporte
- [x] [BACKEND] - [HU13]: Desarrollar ENDPOINT - Eliminar un reporte
#### Frontend (3 Devs)
- [x] [FRONTEND] - Crear Menú de App Ciudad Escucha
- [x] [FRONTEND] - [HU3] Implementar formulario para Crear reporte ciudadano
- [x] [FRONTEND] - [HU5] Implementar sección para Consultar lista de reportes creados
- [x] [FRONTEND] - [HU4] Visualizar reportes en mapa interactivo - Visualización Inicial
#### Project Manager (PM)
- [x] [PM] - Supervisar integración de la funcionalidad de reportes
#### QA (1 Dev)
- [x] [QA] - Configuración de Postman
- [x] [QA] - Definir criterios de aceptación para HU3, HU4 y HU5
#### UX/UI (1 Dev)
- [x] [UX/UI] - Definir Guía de Estilos -  Manual de Marca
- [x] [UX/UI] - Diseñar interfaz de menú para App Ciudad Escucha
- [x] [UX/UI] - [HU3] Diseñar interfaz de Creación de reporte ciudadano
- [x] [UX/UI] - [HU5] Diseñar interfaz de Consultar lista de reportes creados
- [x] [UX/UI] - [HU4] Diseñar interfaz del mapa interactivo




### 🔹 **Sprint 2 - Visualización de reportes y notificaciones en tiempo real (Completado) ✅**  
#### Backend (2 Devs)
- [x] [BACKEND] - [HU4]: Desarrollar ENDPOINT - Visualizar reportes en el mapa
- [x] [BACKEND] - [HU6]: Desarrollar ENDPOINT - Recibir notificaciones en tiempo real
#### Frontend (3 Devs)
- [x] [FRONTEND] - [HU5] Implementar lista de reportes recientes
- [x] [FRONTEND] - [HU6] Configurar notificaciones push*
- [x] [FRONTEND] - Crear Boton de User Menu
- [x] [FRONTEND] - Crear Iconos especializados para el Frontend de la App Urbia
- [x] [FRONTEND] - [HU4]  Conectar con Backend: Visualizar reportes en mapa interactivo
- [x] [FRONTEND] - [HU3] Conectar con Backend: Formulario para Crear reporte ciudadano
- [x] [FRONTEND] - [HU5] Conectar con Backend: Sección para Consultar lista de reportes creados
- [x] [FRONTEND] - [HU5] Implementar Ver Reportes - Mis Reportes
- [x] [FRONTEND] - [HU5] Implementar Editar Reporte - Mis Reportes
- [x] [FRONTEND] - [HU5] Implementar Eliminar Reporte - Mis Reportes
#### Project Manager (PM)
- [x] [PM] - Creación de Plantilla para llenado de Matriz de Riesgo
- [x] [PM] - Validar integración de reportes y notificaciones
#### QA (1 Dev)
- [x] [QA] - Pruebas en creación de reportes
- [x] [QA] - Pruebas de visualización de reportes 
- [x] [QA] - Pruebas de visualización de  notificaciones
#### UX/UI (1 Dev)
- [x] [UX/UI] - [HU5] Diseñar interfaz Ver un Reporte - Desde “Mis Reportes”
- [x] [UX/UI] - [HU4] Diseñar interfaz Ver un Reporte - Desde Mapa Interactivo
- [x] [UX/UI] - [HU12] Diseñar interfaz Modificar un Reporte
- [x] [UX/UI] - [HU13] Diseñar interfaz Eliminar un Reporte
- [x] [UX/UI] - [HU13] Diseñar interfaz Botón de User Menú*



### 🔹 **Sprint 3 - Interacción y moderación de reportes. Análisis de reportes con IA (Completado) ✅**  
#### Backend (2 Devs)
- [x] [BACKEND] - [HU8] Comentar en reportes
- [x] [BACKEND] - [HU9] Marcar un reporte como relevante
- [x] [BACKEND] - Implementar sistema de moderación de reportes*
#### Frontend (3 Devs)
- [x] [FRONTEND] - [HU8] Permitir comentarios en reportes
- [x] [FRONTEND] - [HU9] Implementar botón de relevancia en reportes
- [x] [FRONTEND] - Implementar alertas de moderación
#### Project Manager (PM)
- [x] [PM] - Validar funcionalidad de interacción y moderación
#### QA (1 Dev)
- [x] [QA] - Pruebas de comentarios y relevancia
- [x] [QA] - Validar moderación de reportes
- [x] [QA] - Pruebas manuales y unitarias  
- [x] [QA] - Corrección de bugs críticos  
- [x] [QA] - Mejoras en rendimiento y accesibilidad  
#### UX/UI (1 Dev)
- [x] [UX/UI] - Ajustes en interfaz de reportes y comentarios



### 🔹 **Sprint 4 - Autenticación / Entrega Final (Completado) ✅** 
#### Backend (2 Devs)
- [x] [BACKEND] - [HU1] Registrar usuario
- [x] [BACKEND] - [HU2] Iniciar sesión
- [x] [BACKEND] - [HU10] Analizar reportes con IA
- [x] [BACKEND] - Mejoras en rendimiento y seguridad
#### Frontend (3 Devs)
- [x] [FRONTEND] - [HU1] Implementar formulario de registro de usuario
- [x] [FRONTEND] - [HU2] Implementar formulario de inicio de sesión
- [x] [FRONTEND] - [HU10] Integrar análisis de IA en reportes
- [x] [FRONTEND] - Ajustes de UI y optimización
#### Project Manager (PM)
- [x] [PM] - Validación final del MVP
- [x] [PM] - Documentación final del proyecto
- [x] [PM] - Preparar documentación final  
- [x] [PM] - Presentación del proyecto  
#### QA (1 Dev)
- [x] [QA] - Pruebas finales de todo el sistema
#### UX/UI (1 Dev)
- [x] [UX/UI] - Ajustes finales en interfaz
#### TEAM
- [x] Desplegar la versión final del MVP.  


🚀 Este documento se actualiza en cada sprint según avances del equipo.
