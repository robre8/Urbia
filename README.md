# 🏙️ Urbia - Ciudad Escucha

> Plataforma de reportes urbanos en tiempo real con inteligencia artificial

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Ver documentación detallada:**
- [📕 Frontend](./Frontend/README.md) - React + Vite + TailwindCSS
- [📘 Backend](./Backend/README.md) - Python + FastAPI
- [🚀 Deployment](./DEPLOYMENT.md) - Guía de despliegue
- [📝 Changelog](./CHANGELOG.md) - Historial de cambios

---

## 📋 Acerca del Proyecto

**Urbia "Ciudad Escucha"** es una plataforma web que transforma la voz de la comunidad en acción. Permite a los ciudadanos reportar incidentes urbanos en tiempo real con una interfaz intuitiva estilo Waze, facilitando una ciudad más conectada y segura.

### ✨ Características Principales

- 📍 **Reportes en tiempo real** - Interfaz interactiva con mapas para reportar incidentes
- 🤖 **IA integrada** - Análisis automático de imágenes y audios con Google Gemini
- 🗺️ **Mapas interactivos** - Visualización geolocalizada con OpenStreetMap
- 🔔 **Notificaciones** - Alertas inteligentes sobre eventos en tu ciudad  
- 👥 **Comunidad activa** - Sistema de likes y comentarios para fortalecer la participación
- 📱 **PWA** - Funciona como aplicación nativa en dispositivos móviles
- 🔒 **Autenticación segura** - Sistema JWT para protección de datos

---

## 🛠️ Stack Tecnológico

### Frontend
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

### Backend
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge)](https://www.sqlalchemy.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

### DevOps & Cloud
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

### IA & Servicios
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 18+ y npm
- **Python** 3.11+
- **PostgreSQL** 12+ (o SQLite para desarrollo local)
- **Git**

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/No-Country-simulation/s21-19-t-webapp.git
cd s21-19-t-webapp
```

### Backend Setup

```bash
# 2. Navegar al directorio del backend
cd Backend

# 3. Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver Backend/README.md)

# 6. Inicializar base de datos (opcional - incluye categorías de ejemplo)
python init_db.py

# 7. Ejecutar el servidor
uvicorn main:app --reload
```

El backend estará disponible en:
- 🌐 API: http://localhost:8000
- 📚 Docs (Swagger): http://localhost:8000/docs
- 📖 ReDoc: http://localhost:8000/redoc

### Frontend Setup

```bash
# 8. En otra terminal, navegar al frontend
cd Frontend

# 9. Instalar dependencias
npm install

# 10. Configurar variables de entorno
cp .env.example .env
# Editar VITE_API_URL=http://localhost:8000/api

# 11. Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible en:
- 🌐 App: http://localhost:3000

---

## 📡 API Documentation

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login de usuario  
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)

#### Reportes
- `GET /api/reports` - Listar todos los reportes
- `GET /api/reports/{id}` - Obtener un reporte específico
- `POST /api/reports` - Crear nuevo reporte (requiere auth)
- `PUT /api/reports/{id}` - Actualizar reporte (requiere auth)
- `DELETE /api/reports/{id}` - Eliminar reporte (requiere auth)
- `POST /api/reports/{id}/upload-image` - Subir imagen (requiere auth)
- `POST /api/reports/{id}/like` - Dar like a un reporte (requiere auth)

#### Categorías
- `GET /api/categories` - Listar todas las categorías

### Documentación Interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🌐 Deployment

### Producción

- **Frontend**: Desplegado en [Vercel](https://vercel.com/)
- **Backend**: Desplegado en [Render](https://render.com/)
- **Base de Datos**: PostgreSQL en Render

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue.

### Variables de Entorno

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/urbia_db
JWT_SECRET_KEY=your-secret-key-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
GEMINI_API_KEY=your-gemini-api-key
DEBUG=false
```

#### Frontend (.env)
```env
VITE_API_URL=https://tu-backend.onrender.com/api
```

---

## 👥 Equipo

### 👷‍♂️ Project Manager
| <img src="https://avatars.githubusercontent.com/u/135073545?v=4" width="100" height="100"> |
|:-:|
| **Alejandro Luna** |
| [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AlejandroLunaDev) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]() |

### 🎨 UX/UI Designer
| <img src="https://avatars.githubusercontent.com/u/138052981?v=4" width="100" height="100"> |
|:-:|
| **Santiago Garcia** |
| [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/santigarciaa) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]() |

### 🧑‍💻 Frontend Team
| <img src="https://avatars.githubusercontent.com/u/135073545?v=4" width="100" height="100"> | <img src="https://avatars.githubusercontent.com/u/125300652?v=4" width="100" height="100"> | <img src="https://avatars.githubusercontent.com/u/47112525?v=4" width="100" height="100"> |
|:-:|:-:|:-:|
| **Alejandro Luna** | **Celina Garcés** | **Cesar Hernan Ruscica** |
| [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AlejandroLunaDev) | [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/celinagrcs) | [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hernanruscica) |

### 💻 Backend Team
| <img src="https://avatars.githubusercontent.com/u/84197042?v=4" width="100" height="100"> | <img src="https://avatars.githubusercontent.com/u/138052981?v=4" width="100" height="100"> | <img src="https://avatars.githubusercontent.com/u/138052981?v=4" width="100" height="100"> |
|:-:|:-:|:-:|
| **Daiana Amado** | **Alberto Gutierrez** | **Ronny Brenes** |
| [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Daiana-Amado) | [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Albert0GR) | [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/robre8) |

### 🧪 QA Manual
| <img src="https://avatars.githubusercontent.com/u/107267047?v=4" width="100" height="100"> |
|:-:|
| **Sara Elizabeth Alcántara** |
| [![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SaraAlcantara) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]() |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

## 🔗 Enlaces

- **Repositorio**: [GitHub](https://github.com/No-Country-simulation/s21-19-t-webapp)
- **Documentación Frontend**: [Frontend README](./Frontend/README.md)
- **Documentación Backend**: [Backend README](./Backend/README.md)
- **Guía de Despliegue**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

<div align="center">

**Desarrollado con ❤️ por el equipo de No Country - Cohorte s21-19-t**

[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)
[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://slack.com)

</div>
