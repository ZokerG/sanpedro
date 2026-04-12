-- Migración: Eliminar columna 'activo' de tabla personal
-- Motivo: El campo activo ahora se calcula en runtime basado en documentosCompletos
-- No se necesita persistir en la base de datos.

ALTER TABLE personal DROP COLUMN IF EXISTS activo;
