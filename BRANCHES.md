# 🌿 Estructura de Ramas - Urbia

## Ramas Principales

### `main` - Producción
- Código estable listo para producción
- Todos los cambios pasan por revisión antes de merge
- Deployado automáticamente en producción
- **Protegida**: No hacer push directamente

### `dev` - Desarrollo
- Rama activa de desarrollo
- Todos los cambios y features se integran aquí primero
- Auto-deployment a entornos de preview/staging
- Cuando esté estable, se mergea a `main`

---

## 🔄 Flujo de Trabajo

### Para Desarrollo Normal

```bash
# 1. Asegurarte de estar en dev y actualizado
git checkout dev
git pull origin dev

# 2. Hacer tus cambios
# ... editar archivos ...

# 3. Commitear y push
git add .
git commit -m "feat: descripción del cambio"
git push origin dev
```

### Para Features Grandes

```bash
# 1. Crear rama de feature desde dev
git checkout dev
git checkout -b feature/nombre-feature

# 2. Desarrollar la feature
# ... hacer cambios ...
git add .
git commit -m "feat: implementar feature X"

# 3. Cuando esté lista, mergear a dev
git checkout dev
git merge feature/nombre-feature
git push origin dev

# 4. Eliminar rama de feature
git branch -d feature/nombre-feature
```

### Para Mergear a Producción

```bash
# 1. Asegurarte que dev esté estable y testeado
git checkout dev
git pull origin dev

# 2. Mergear dev a main
git checkout main
git pull origin main
git merge dev

# 3. Push a main (deploy a producción)
git push origin main

# 4. Volver a dev para continuar desarrollo
git checkout dev
```

---

## ✅ Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, sin cambios de código
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

Ejemplos:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve CORS issue in API"
git commit -m "docs: update deployment guide"
```

---

## 🧹 Limpieza Realizada

Se eliminaron las siguientes ramas obsoletas:
- ❌ `#26-frontend--Form-generar-confirmar-reporte`
- ❌ `110-backend---hu9-desarrollar-endpoint---marcar-un-reporte-como-relevante`
- ❌ `127-bug---los-iconos-no-quedan-alineados-con-el-nombre-de-la-categoria`
- ❌ `152-frontend---hu1-implementar-formulario-para-registrar-usuario`
- ❌ `31-frontend---crear-iconos-especializados-para-el-frontend-de-la-app-urbia`
- ❌ `58-frontend---crear-capa-de-servicio-para-conectar-con-bakernd`
- ❌ `69-frontend---hu5-implementar-listar-los-reportes-creados-por-usuario-logueado---conectar-con-backend`
- ❌ `71-frontend---hu5-implementar-eliminar-reporte---mis-reportes`
- ❌ `84-backend---desarrollar-endpoint---implementación-de-ia-para-audio-e-imagen-ok`
- ❌ `back-back`
- ❌ `back-test-login-init`
- ❌ `backend-dev`
- ❌ `backend-devprueba`
- ❌ `frontend-dev` → renombrada a `dev`
- ❌ `frontend-bug`
- ❌ `implementacion-CRUD-mensajes-para-reportes`
- ❌ `likes`

**Resultado**: Estructura limpia con solo 2 ramas principales ✨

---

## 📊 Estado Actual

```bash
# Ver ramas locales
git branch

# Ver ramas remotas
git branch -r

# Ver todas las ramas
git branch -a
```

**Output esperado**:
```
* dev
  remotes/origin/HEAD -> origin/main
  remotes/origin/dev
  remotes/origin/main
```

---

## 🚀 Despliegue

- **`dev`** → Auto-deploy a preview/staging (Vercel + Render)
- **`main`** → Auto-deploy a producción (Vercel + Render)

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles.

---

**Última actualización**: 2026-02-25
