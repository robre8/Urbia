# 🔀 GIT Workflow y Convención de Commits

Este documento describe el flujo de trabajo en Git y la convención de commits para mantener una estructura organizada en el desarrollo del proyecto "Ciudad Escucha".

## 🚀 Flujo de Trabajo en Git
1. **Crear una rama a partir de `dev`**:
   ```sh
   git checkout dev
   git pull origin dev
   git checkout -b feature/nueva-funcionalidad
   ```
2. **Realizar cambios y hacer commits siguiendo la convención**.
3. **Hacer push de la rama**:
   ```sh
   git push origin feature/nueva-funcionalidad
   ```
4. **Crear un Pull Request (PR) a `dev`** y asignar a un revisor.
5. **Mergear a `dev` tras aprobación** y eliminar la rama.
6. **El equipo decide cuándo mergear `dev` a `main` para despliegues.**

### 🔹 Mantenimiento de Ramas
- **Guardar cambios temporalmente antes de cambiar de rama:**
  ```sh
  git stash
  ```
- **Aplicar cambios guardados con `stash`:**
  ```sh
  git stash pop
  ```
- **Eliminar ramas remotas que ya no existen:**
  ```sh
  git fetch -p
  ```
- **Eliminar ramas locales que ya no existen en el remoto:**
  ```sh
  git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
  ```

---

## 🎯 Convención de Emojis para Commits (en español)

Cada commit debe incluir un **emoji** para indicar su propósito y redactarse en español.

| Tipo                | Emoji | Ejemplo de Commit |
|--------------------|--------|-------------------------------|
| **Nueva funcionalidad** | 🚀 `:construction:` | `🚀 Agregar nueva funcionalidad al dashboard de usuario` |
| **Corrección de errores** | 🐛 `:bug:` | `🐛 Corregir error en el inicio de sesión con contraseñas vacías` |
| **Refactorización** | ♻️ `:recycle:` | `♻️ Refactorizar servicio de autenticación` |
| **Estilos y UI** | 💄 `:lipstick:` | `💄 Actualizar efecto hover en botones` |
| **Documentación** | 📝 `:memo:` | `📝 Agregar ejemplos de uso de la API` |
| **Mejoras de rendimiento** | ⚡ `:zap:` | `⚡ Mejorar rendimiento en consultas a la base de datos` |
| **Tests** | ✅ `:white_check_mark:` | `✅ Agregar pruebas unitarias al servicio de usuarios` |
| **Mantenimiento** | 🛠️ `:hammer_and_wrench:` | `🛠️ Actualizar dependencias` |
| **Configuraciones de build** | 🏗️ `:building_construction:` | `🏗️ Actualizar configuración de Webpack` |
| **CI/CD** | 🚀 `:rocket:` | `🚀 Agregar GitHub Actions para el despliegue` |
| **Revertir cambios** | ⏪ `:rewind:` | `⏪ Revertir cambios en el modelo de usuario` |
| **Seguridad** | 🔒 `:lock:` | `🔒 Corregir exposición de tokens en logs` |
| **Deprecaciones** | 💀 `:skull:` | `💀 Marcar endpoint de autenticación como obsoleto` |
| **Corrección crítica** | 🚑 `:ambulance:` | `🚑 Corregir error crítico en producción` |
| **UI/UX** | 🎨 `:art:` | `🎨 Mejorar diseño responsivo del layout` |
| **Base de Datos** | 🗂️ `:card_file_box:` | `🗂️ Agregar migración para roles de usuario` |

---

💡 **Recuerda:** Antes de hacer un commit, ejecuta `git status` para revisar los cambios y `git pull` para asegurarte de estar actualizado. ¡Colaboremos con un flujo limpio y organizado! 🚀

