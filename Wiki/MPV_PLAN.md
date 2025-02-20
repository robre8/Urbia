# 📅 Planificación del MVP - "Ciudad Escucha" 🚀  

## 📌 Sprints y Objetivos  
| Sprint | Enfoque | Tareas Clave | Prioridad |
|---------|------------|----------------------------------------|------------|
| **Sprint 0** ✅ | 🔧 **Configuración Inicial** | Configuración de repos, CI/CD, estructura del monorepo, integración de mapas y autenticación básica. | **P0** |
| **Sprint 1** | 📌 **Reportes y Visualización** | Implementar reportes con imagen/audio y vista en mapa con filtros. **Se comienza a implementar UI en código**. | **P1** |
| **Sprint 2** | 🔔 **Notificaciones y Mejoras** | Agregar WebSockets/Polling, optimizar UI/UX y pruebas de integración. | **P1/P2** |
| **Sprint 3** | 🚀 **Optimización y QA** | QA Manual, pruebas finales, mejoras de rendimiento y ajustes UI/UX. | **P2** |
| **Sprint 4** | 🏁 **Entrega Final** | Presentación, documentación y despliegue definitivo. | **P2** |

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
### 🔹 **Sprint 0 - Configuración Inicial (Completado) ✅**  
- [x] Configurar repositorios en GitHub  
- [x] Configurar CI/CD con GitHub Actions y Railway/Vercel  
- [x] Crear estructura del monorepo  
- [x] Definir estándares de commits y convenciones de PR  
- [x] Integrar OpenStreetMap en el frontend  
- [x] Configurar autenticación básica en backend  

### 🔹 **Sprint 1 - Desarrollo de funcionalidades principales**  
- [ ] Implementar sistema de reportes con imágenes/audio  
- [ ] Crear API para reportes y almacenamiento en S3/Cloudflare  
- [ ] Implementar visualización en el mapa con filtros  
- [ ] **Comenzar a trasladar los diseños UX/UI a código**  

### 🔹 **Sprint 2 - Notificaciones y Mejoras**  
- [ ] Agregar WebSockets/Polling para datos en tiempo real  
- [ ] Optimizar UI/UX basado en feedback  
- [ ] Agregar validaciones en backend para seguridad  

### 🔹 **Sprint 3 - Optimización y QA**  
- [ ] Pruebas manuales y unitarias  
- [ ] Corrección de bugs críticos  
- [ ] Mejoras en rendimiento y accesibilidad  

### 🔹 **Sprint 4 - Entrega Final**  
- [ ] Preparar documentación final  
- [ ] Desplegar la versión final del MVP  
- [ ] Presentación del proyecto  

🚀 Este documento se actualiza en cada sprint según avances del equipo.