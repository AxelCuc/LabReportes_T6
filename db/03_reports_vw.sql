-- ============================================
-- REPORTS_VW.SQL - Vistas de Reportes
-- ============================================
-- Proyecto: Tarea 6 - Lab Reportes
-- Autor: [Axel Rodrigo Cuc López]
-- ============================================

-- ============================================
-- VIEW: vw_ventas_por_categoria
-- Qué devuelve:
--   Ventas totales por categoría de producto.
-- Grain:
--   Una fila representa una categoría.
-- Métricas:
--   total_ventas (SUM de subtotales).
-- Por qué GROUP BY:
--   Para agregar las ventas por cada categoría.
-- VERIFY:
--   SELECT * FROM vw_ventas_por_categoria;
-- ============================================

CREATE OR REPLACE VIEW vw_ventas_por_categoria AS
SELECT
    c.id AS categoria_id,
    c.nombre AS categoria,
    SUM(od.subtotal) AS total_ventas
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
JOIN orden_detalles od ON od.producto_id = p.id
GROUP BY
    c.id,
    c.nombre;

-- ============================================
-- VIEW: vw_productos_mas_vendidos
-- Qué devuelve:
--   Productos con sus unidades totales vendidas y nivel de venta.
-- Grain:
--   Una fila representa un producto.
-- Métricas:
--   unidades_vendidas (SUM de cantidad).
-- Por qué GROUP BY:
--   Para agrupar las ventas por producto.
-- Por qué HAVING:
--   Para excluir productos sin ventas.
-- VERIFY:
--   SELECT * FROM vw_productos_mas_vendidos;
-- ============================================

CREATE OR REPLACE VIEW vw_productos_mas_vendidos AS
SELECT
    p.id AS producto_id,
    p.nombre AS producto,
    SUM(od.cantidad) AS unidades_vendidas,
    CASE
        WHEN SUM(od.cantidad) >= 3 THEN 'Alta'
        WHEN SUM(od.cantidad) >= 2 THEN 'Media'
        ELSE 'Baja'
    END AS nivel_venta
FROM productos p
JOIN orden_detalles od ON od.producto_id = p.id
GROUP BY
    p.id,
    p.nombre
HAVING
    SUM(od.cantidad) > 0;

-- ============================================
-- VIEW: vw_clientes_top
-- Qué devuelve:
--   Usuarios con su gasto total acumulado.
-- Grain:
--   Una fila representa un usuario.
-- Métricas:
--   gasto_total (SUM de subtotales).
-- Por qué GROUP BY:
--   Para agregar el gasto por usuario.
-- Por qué HAVING:
--   Para mostrar solo usuarios con gasto significativo.
-- Uso de CTE:
--   El CTE calcula primero el gasto total por usuario.
-- VERIFY:
--   SELECT * FROM vw_clientes_top;
-- ============================================

CREATE OR REPLACE VIEW vw_clientes_top AS
WITH gasto_por_usuario AS (
    SELECT
        u.id AS usuario_id,
        u.nombre AS usuario,
        SUM(od.subtotal) AS gasto_total
    FROM usuarios u
    JOIN ordenes o ON o.usuario_id = u.id
    JOIN orden_detalles od ON od.orden_id = o.id
    GROUP BY
        u.id,
        u.nombre
)
SELECT
    usuario_id,
    usuario,
    gasto_total
FROM gasto_por_usuario
GROUP BY
    usuario_id,
    usuario,
    gasto_total
HAVING
    gasto_total > 500;


-- ============================================
-- VIEW: vw_ranking_productos_categoria
-- Qué devuelve:
--   Ranking de productos por categoría según unidades vendidas.
-- Grain:
--   Una fila representa un producto dentro de una categoría.
-- Métricas:
--   unidades_vendidas (SUM de cantidad).
-- Uso de Window Function:
--   ROW_NUMBER para generar ranking por categoría.
-- VERIFY:
--   SELECT * FROM vw_ranking_productos_categoria;
-- ============================================

CREATE OR REPLACE VIEW vw_ranking_productos_categoria AS
SELECT
    categoria,
    producto,
    unidades_vendidas,
    ROW_NUMBER() OVER (
        PARTITION BY categoria
        ORDER BY unidades_vendidas DESC
    ) AS ranking_categoria
FROM (
    SELECT
        c.nombre AS categoria,
        p.nombre AS producto,
        SUM(od.cantidad) AS unidades_vendidas
    FROM categorias c
    JOIN productos p ON p.categoria_id = c.id
    JOIN orden_detalles od ON od.producto_id = p.id
    GROUP BY
        c.nombre,
        p.nombre
) sub;

-- ============================================
-- VIEW: vw_ordenes_por_status
-- Qué devuelve:
--   Cantidad y porcentaje de órdenes por status.
-- Grain:
--   Una fila representa un status de orden.
-- Métricas:
--   total_ordenes (COUNT)
--   porcentaje_total (% del total de órdenes)
-- Uso de COALESCE:
--   Evita valores nulos en el cálculo del porcentaje.
-- VERIFY:
--   SELECT * FROM vw_ordenes_por_status;
-- ============================================

CREATE OR REPLACE VIEW vw_ordenes_por_status AS
WITH total_ordenes AS (
    SELECT COUNT(*) AS total
    FROM ordenes
)
SELECT
    o.status,
    COUNT(o.id) AS total_ordenes,
    COALESCE(
        ROUND(COUNT(o.id)::numeric / t.total * 100, 2),
        0
    ) AS porcentaje_total
FROM ordenes o
CROSS JOIN total_ordenes t
GROUP BY
    o.status,
    t.total;

-- ============================================
-- VIEW: vw_clasificacion_clientes
-- Qué devuelve:
--   Clasificación de clientes según su gasto total.
-- Grain:
--   Una fila representa un usuario.
-- Métricas:
--   gasto_total (SUM de subtotales).
-- Uso de CASE:
--   Clasifica a los clientes en niveles de gasto.
-- VERIFY:
--   SELECT * FROM vw_clasificacion_clientes;
-- ============================================

CREATE OR REPLACE VIEW vw_clasificacion_clientes AS
SELECT
    u.id AS usuario_id,
    u.nombre AS usuario,
    SUM(od.subtotal) AS gasto_total,
    CASE
        WHEN SUM(od.subtotal) >= 1000 THEN 'Premium'
        WHEN SUM(od.subtotal) >= 500 THEN 'Regular'
        ELSE 'Basico'
    END AS nivel_cliente
FROM usuarios u
JOIN ordenes o ON o.usuario_id = u.id
JOIN orden_detalles od ON od.orden_id = o.id
GROUP BY
    u.id,
    u.nombre;
