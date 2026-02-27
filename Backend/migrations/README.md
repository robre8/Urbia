# Database Migrations

## 001_expand_password_hash.sql

**Propósito:** Expandir la columna `password_hash` de 255 a 500 caracteres para soportar hashes más largos de Argon2.

**Cambio de algoritmo:** Bcrypt → Argon2
- Bcrypt: hash típicamente ~60 caracteres
- Argon2: hash típicamente ~100-150 caracteres

**Cómo aplicar en Railway:**

### Opción 1: Usando Railway CLI (Recomendado)
```bash
# Conectar a la base de datos de Railway
railway database psql

# Ejecutar la migración
\i migrations/001_expand_password_hash.sql

# Verificar el cambio
\d users
```

### Opción 2: Por UI de Railway
1. Ir a Project > PostgreSQL > Connect
2. Copiar credenciales
3. Usar DBeaver o pgAdmin
4. Ejecutar el SQL del archivo

### Opción 3: Por shell en Railway
```bash
psql $DATABASE_URL < migrations/001_expand_password_hash.sql
```

## Status

- [x] 001_expand_password_hash.sql - Ejecutar ANTES de desplegar código con argon2
