-- ============================================
-- INDEXES.SQL - Índices para optimizar reportes
-- ============================================

-- Índice para optimizar joins entre orden_detalles y productos
CREATE INDEX idx_orden_detalles_producto_id
ON orden_detalles(producto_id);

-- Índice para optimizar joins entre ordenes y usuarios
CREATE INDEX idx_ordenes_usuario_id
ON ordenes(usuario_id);

-- Índice para optimizar agrupaciones por status de orden
CREATE INDEX idx_ordenes_status
ON ordenes(status);
