# 📚 Readme for Ciudad Escucha ✨

- `📚 Root`/[`📕 Frontend`](./Frontend/README.MD)/
- `📚 Root`/[`📘 Backend`](./Backend/README.MD)/

## 📖 Table Of Contents

- [📚 Readme for Ciudad Escucha ✨](#-readme-for-ciudad-escucha-)
  - [📖 Table Of Contents](#-table-of-contents)
  - [📋 About this project 🔝](#-about-this-project-)
  - [⚙️ Technology Stack 🔝](#️-technology-stack-)
    - [🎨 UX UI Design 🔝](#-ux-ui-design-)
    - [🎆 Front End 🔝](#-front-end-)
    - [🧰 Back End 🔝](#-back-end-)
    - [🌠 Quality Assurance 🔝](#-quality-assurance-)
  - [🛠 Installation \& Setup 🔝](#-installation--setup-)
    - [Prerequisites](#prerequisites)
    - [Steps to Run](#steps-to-run)
  - [🚀 Deployment \& CI/CD 🔝](#-deployment--cicd-)
  - [📡 API Documentation 🔝](#-api-documentation-)
  - [🤵‍♂️ Team communication channels 🔝](#️-team-communication-channels-)
  - [🗃️ Project info 🔝](#️-project-info-)
    - [📚 License 🔝](#-license-)
    - [📚 Workspaces info 🔝](#-workspaces-info-)
    - [📚 Deploy 🔝](#-deploy-)
    - [🎆 Front End 🔝](#-front-end--1)
    - [🧰 Back End 🔝](#-back-end--1)
    - [🌠 Quality Assurance 🔝](#-quality-assurance--1)
  - [🤵‍♂️ Team communication channels 🔝](#️-team-communication-channels--1)
  - [🤵‍♂️Teams 🔝](#️teams-)
    - [👷‍♂️ Project Manager 🔝](#️-project-manager-)
    - [🎨 UX/UI 🔝](#-uxui-)
    - [🧑‍💻 Frontend 🔝](#-frontend-)
    - [💻 Backend 🔝](#-backend-)
    - [🧪 QA Manual 🔝](#-qa-manual-)

## 📋 About this project [🔝](#-readme-for-ciudad-escucha-)

🚀 Presentamos **"Ciudad Escucha"** – La plataforma que transforma la voz de la comunidad en acción 🏙️🔊

Imagina una ciudad donde la información fluye en tiempo real y los ciudadanos pueden ayudarse entre sí. "Ciudad Escucha" es una plataforma donde cualquier persona puede reportar incidentes urbanos al instante, simplemente subiendo una foto y comentando con su voz, mientras una IA analiza y genera un reporte detallado.

📍 **Características:**
- Interfaz estilo **Waze** para reportes comunitarios en tiempo real.
- **Inteligencia Artificial** para analizar imágenes y audios.
- **Mapas interactivos** para visualizar y gestionar incidentes.
- **Notificaciones inteligentes** para alertar a la comunidad sobre eventos en su ciudad.

🎯 **Objetivo:** Crear una red de ciudadanos informados y conectados, promoviendo seguridad y acción inmediata ante incidentes urbanos.

## ⚙️ Technology Stack [🔝](#-readme-for-ciudad-escucha-)

### 🎨 UX UI Design [🔝](#-ux-ui-design-)

[![Figma Link](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)

### 🎆 Front End [🔝](#-front-end-)

- **React + TailwindCSS**
- **Zustand** para gestión de estado.
- **Mapas interactivos** con OpenStreetMap.

### 🧰 Back End [🔝](#-back-end-)

- **Java Spring Boot**
- **PostgreSQL**
- **Procesamiento de imágenes y audio con IA** (API gratuita)
- **WebSockets / Polling** para actualizaciones en tiempo real.

### 🌠 Quality Assurance [🔝](#-quality-assurance-)

- **Testing manual** con casos de prueba.

## 🛠 Installation & Setup [🔝](#-installation--setup-)

### Prerequisites
- Node.js & npm
- Java JDK 17+
- PostgreSQL
- Docker (opcional)

### Steps to Run
```sh
# Clonar el repositorio
git clone https://github.com/ciudad-escucha
cd ciudad-escucha

# Instalar dependencias del frontend
cd Frontend
npm install
npm run dev

# Configurar y ejecutar el backend
cd ../Backend
mvn spring-boot:run
```

## 🚀 Deployment & CI/CD [🔝](#-deployment--cicd-)
- **Railway / Vercel**: Configuración automática para despliegue.
- **GitHub Actions**: Automatización del despliegue al hacer push en `main`.

## 📡 API Documentation [🔝](#-api-documentation-)
- **Base URL**: `https://api.ciudadescucha.com`
- **Endpoints:**
  - `POST /reports` - Crear un nuevo reporte
  - `GET /reports` - Obtener reportes existentes
  - `GET /reports/:id` - Obtener un reporte específico
  - `POST /upload` - Subir imágenes o audios

## 🤵‍♂️ Team communication channels [🔝](#-team-communication-channels-)

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)

## 🗃️ Project info [🔝](#-project-info-)

### 📚 License [🔝](#-license-)

| License | [![License Link](https://img.shields.io/badge/MIT-FF0000?style=for-the-badge)](./LICENSE.MD) |
| :-: | :-: |

### 📚 Workspaces info [🔝](#-workspaces-info-)

| Name | Path | Description |
| :-: | :-: | :-: |
| `✨ root` | / | The project's root path |
| `🖼️ Frontend` | /Frontend | Application Front-End |
| `🎛️ Backend` | /Backend | Application Back-End |

### 📚 Deploy [🔝](#-deploy-)

| Description | Deploy | Link |
| :-: | :-: | :-: |
| Repository | [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white)](https://github.com) | [Repo App](https://github.com) |
| Frontend | Por desplegar | Sin enlace |
| Backend | Por desplegar | Sin enlace |

### 🎆 Front End [🔝](#-readme-for-app-)

[![TypeScript Link](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white 'TypeScript Link')](https://www.typescriptlang.org/) [![React Link](  https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB 'React Link')](https://react.dev/)[![Next Link](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white 'Next Link')](https://nextjs.org/)
[![tailwind Link](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white 'Tailwind Link')](https://tailwindcss.com/) [![PossCss Link](https://img.shields.io/badge/posscss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=DD3A0A&color=ffffff 'PossCss Link')](https://postcss.org/) [![Shadcn/ui link](https://img.shields.io/badge/shadcn%2Fui-ffffff?style=for-the-badge&logo=shadcnui&logoColor=ffffff&color=000000 'Shadcn/ui Link')](https://ui.shadcn.com/)
[![Zod Link](https://img.shields.io/badge/zod-3E67B1?style=for-the-badge&logo=zod&logoColor=892CA0&color=313131)](https://zod.dev/ 'Zod Link')[![Zustand Link](https://img.shields.io/badge/zustand-3E67B1?style=for-the-badge&color=714B67 'Zustand Link')](https://zustand-demo.pmnd.rs/)[![JSON_WEB_TOKENS](https://img.shields.io/badge/JSON_WEB_TOKENS-212121?style=for-the-badge&logo=jsonwebtokens&logoColor=ffffff 'JSON_WEB_TOKENS')](https://jwt.io/)
[![Eslint link](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white 'Eslint Link')](https://eslint.org/) [![Prettier link](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E 'Prettier Link')](https://prettier.io/)

### 🧰 Back End [🔝](#-readme-for-app-)

[![Python Link](https://img.shields.io/badge/Python-%20%233776AB?style=for-the-badge&logo=Python&logoColor=%23FFFFFF 'Python Link')](https://www.python.org/) [![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](#) [![Django](https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white&style=for-the-badge)](#) [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)](#)

### 🌠 Quality Assurance [🔝](#-readme-for-app-)

[![Excel Link](https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white 'Excell Link')](https://www.office.com/) [![Word Link](https://img.shields.io/badge/Microsoft_Word-2B579A?style=for-the-badge&logo=microsoft-word&logoColor=white 'Word Link')](https://www.office.com/) 

## 🤵‍♂️ Team communication channels [🔝](#-readme-for-app-)

[![Slack Link](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white 'Slack Link')](https://slack.com) [![Discord Link](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white 'Discord Link')](https://discord.com) [![LinkedIn Link](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')](https://linkedIn.com) [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/No-Country-simulation/s18-03-m-python-react)

## 🤵‍♂️Teams [🔝](#-teams-)

### 👷‍♂️ Project Manager [🔝](#-project-manager-)

| ![Avatar](https://avatars.githubusercontent.com/u/135073545?s=96&v=4 'Project Manager') |
|:-:|
| **Alejandro Luna** |
| [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/AlejandroLunaDev) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() |

### 🎨 UX/UI [🔝](#-uxui-)

| ![Avatar](https://avatars.githubusercontent.com/u/138052981?s=96&v=4) |
|:-:|
| **Santiago Garcia** |
| [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/santigarciaa) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() |

### 🧑‍💻 Frontend [🔝](#-frontend-)

| ![Avatar](https://avatars.githubusercontent.com/u/135073545?s=96&v=4) | ![Avatar](https://avatars.githubusercontent.com/u/125300652?s=96&v=4) | ![Avatar](https://avatars.githubusercontent.com/u/47112525?s=96&v=4) |
|:-:|:-:|:-:|
| **Alejandro Luna** | **Celina Garcés** | **Cesar Hernan Ruscica** |
| [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/AlejandroLunaDev) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() | [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/celinagrcs) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() | [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/hernanruscica) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() |

### 💻 Backend [🔝](#-backend-)

| ![Avatar](https://avatars.githubusercontent.com/u/84197042?s=96&v=4) | ![Avatar](https://avatars.githubusercontent.com/u/138052981?s=96&v=4) | ![Avatar](https://avatars.githubusercontent.com/u/138052981?s=96&v=4) |
|:-:|:-:|:-:|
| **Daiana Amado** | **Alberto Gutierrez** | **Ronny Brenes** |
| [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/Daiana-Amado) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() | [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/Albert0GR) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() | [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/robre8) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() |

### 🧪 QA Manual [🔝](#-qa-manual-)

| ![Avatar](https://avatars.githubusercontent.com/u/107267047?s=96&v=4) |
|:-:|
| **Sara Elizabeth Alcántara** |
| [![Github Link](https://img.shields.io/badge/github-%23121011.svg?&style=for-the-badge&logo=github&logoColor=white 'Github Link')](https://github.com/SaraAlcantara) [![LinkedIn Link](https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white 'LinkedIn Link')]() |

