#!/bin/bash

# =================================================================
# VERIFY.SH - Validador rápido de vistas de base de datos
# =================================================================

# Cargar variables de entorno si existe el archivo .env
if [ -f .env ]; then
    # Usamos grep para omitir comentarios y líneas vacías, luego exportamos
    export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

DB_USER=${POSTGRES_USER:-admin}
DB_NAME=${POSTGRES_DB:-tienda}
CONTAINER_NAME="postgres_db"

echo "--------------------------------------------------------"
echo "🔍 Validando vistas en la base de datos: $DB_NAME"
echo "--------------------------------------------------------"

# 1. Listar todas las vistas
echo "📋 Listado de vistas encontradas:"
docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "\dv"
if [ $? -ne 0 ]; then
    echo "❌ Error al intentar conectar con el contenedor o listar vistas."
    exit 1
fi

# 2. Ejecutar un query de validación por cada vista conocida
vistas=(
    "vw_ventas_por_categoria"
    "vw_productos_mas_vendidos"
    "vw_clientes_top"
    "vw_ranking_productos_categoria"
    "vw_ordenes_por_status"
    "vw_clasificacion_clientes"
)

echo ""
echo "⚙️ Ejecutando pruebas de integridad (SELECT LIMIT 1)..."
echo "--------------------------------------------------------"

for vista in "${vistas[@]}"; do
    echo -n "🧪 Probando $vista... "
    # Intentamos seleccionar una fila. Si falla el SQL o la tabla no existe, fallará.
    RESULT=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT 1 FROM $vista LIMIT 1;" 2>&1)
    
    if [[ $RESULT == *"1"* ]]; then
        echo "✅ OK"
    elif [[ $RESULT == "" ]]; then
        # psql con -t devuelve nada si no hay filas
        echo "✅ OK (vista activa, sin datos)"
    else
        echo "❌ ERROR"
        echo "   Detalle: $RESULT"
    fi
done

echo "--------------------------------------------------------"
echo "🚀 Validación completada."
