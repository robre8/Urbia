-- Migración para expandir password_hash de 255 a 500 caracteres
-- Para soportar hashes más largos de Argon2 (vs bcrypt de 72 bytes)

ALTER TABLE users ALTER COLUMN password_hash TYPE VARCHAR(500);

-- Comentario auditoria
COMMENT ON COLUMN users.password_hash IS 'Hash de contraseña (500 chars para Argon2)';
