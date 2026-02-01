-- ============================================
-- ROLES.SQL - Seguridad de base de datos
-- ============================================

-- Crear rol para la aplicación
CREATE ROLE app_user
WITH LOGIN
PASSWORD 'app_password';

-- Permitir conexión a la base de datos
GRANT CONNECT ON DATABASE postgres TO app_user;

-- Permitir uso del schema público
GRANT USAGE ON SCHEMA public TO app_user;

-- Revocar permisos sobre tablas (por seguridad)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

-- Conceder SOLO SELECT sobre las VIEWS
GRANT SELECT ON
    vw_ventas_por_categoria,
    vw_productos_mas_vendidos,
    vw_clientes_top,
    vw_ranking_productos_categoria,
    vw_ordenes_por_status,
    vw_clasificacion_clientes
TO app_user;
