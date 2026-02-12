# Lab Reportes

Una aplicación Next.js moderna para visualización de ventas y métricas de clientes, contenerizada con Docker.

## Instrucciones de Ejecución

El proyecto está configurado para levantarse completamente con un solo comando usando Docker Compose.

1. Abre una terminal en la raíz del proyecto.
2. Ejecuta:
   ```bash
   docker compose up --build
   ```
3. Accede a la aplicación en: [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

- **/db**: Scripts de inicialización de la base de datos (PostgreSQL).
- **/web**: Código fuente de la aplicación Next.js (App Router).
- **docker-compose.yml**: Orquestación de contenedores (App + DB).

## Reportes Incluidos

1.  **Ventas por Categoría** (`/reports/1`)
    -   Vista: `vw_ventas_por_categoria`
    -   Características: Tabla de detalle, KPI de Ventas Totales.

2.  **Productos Más Vendidos** (`/reports/2`)
    -   Vista: `vw_productos_mas_vendidos`
    -   Características: **Paginación (Server-Side)**, KPI de Producto Top.

3.  **Clientes Top** (`/reports/3`)
    -   Vista: `vw_clientes_top`
    -   Características: **Filtro Validado (Zod)** por Gasto Mínimo.

4.  **Distribución de Órdenes** (`/reports/4`)
    -   Vista: `vw_ordenes_por_status`
    -   Características: **Filtro Validado (Zod)** por Status, Gráfico de Barras CSS.

5.  **Clasificación de Clientes** (`/reports/5`)
    -   Vista: `vw_clasificacion_clientes`
    -   Características: **Paginación (Server-Side)**, Badges de estado.

## Detalles Técnicos y Requisitos Extra

- **Healthcheck en DB**: Agregado en `docker-compose.yml` usando `pg_isready`.
- **Dependencia Web**: El servicio `web` ahora depende de que `postgres` esté en estado `healthy`.
- **Configuración**: Se incluyó `.env.example` para la configuración de variables de entorno.
- **Framework**: Next.js 15 (App Router).
- **Estilos**: Tailwind CSS con diseño "Premium".

## Trade-offs (SQL vs Next.js)

- **Cálculos en SQL**: Se decidió realizar todas las agregaciones (`SUM`, `COUNT`), agrupaciones (`GROUP BY`), filtrados (`HAVING`) y funciones de ventana (`ROW_NUMBER`) directamente en las Views de PostgreSQL. 
    - *Razón*: Esto aprovecha el motor de optimización de la base de datos y reduce significativamente la cantidad de datos transferidos a la aplicación Next.js.
- **Formateo en Next.js**: El formateo de moneda (`Intl.NumberFormat`), porcentajes y la lógica de visualización de KPIs se realiza en el servidor de Next.js.
    - *Razón*: Mantiene la separación de preocupaciones, permitiendo que la base de datos entregue datos procesados y la aplicación gestione la presentación.

## Performance Evidence

Se ejecutaron análisis de rendimiento en las vistas principales:

### 1. Vista: `vw_ventas_por_categoria`
```text
HashAggregate  (cost=38.48..40.48 rows=200 width=72) (actual time=0.082..0.085 rows=3 loops=1)
  Group Key: c.id, c.nombre
  ->  Hash Join  (cost=24.58..36.98 rows=200 width=44) (actual time=0.065..0.072 rows=10 loops=1)
        Hash Cond: (p.categoria_id = c.id)
Planning Time: 6.000 ms
Execution Time: 0.434 ms
```
*Explicación*: El uso de `Hash Join` permite procesar las tablas de categorías y productos de manera eficiente, resultando en un tiempo de ejecución menor a 1ms.

### 2. Vista: `vw_ranking_productos_categoria`
```text
WindowAgg  (cost=71.86..75.86 rows=200 width=80) (actual time=0.150..0.165 rows=10 loops=1)
  ->  Sort  (cost=71.86..72.36 rows=200 width=48) (actual time=0.145..0.148 rows=10 loops=1)
Planning Time: 6.125 ms
Execution Time: 1.166 ms
```
*Explicación*: La función de ventana (`ROW_NUMBER`) se ejecuta eficientemente tras un ordenamiento previo, permitiendo obtener el ranking de productos en aprox. 1.1ms.

## Threat Model

- **SQL Injection**: Prevenido mediante el uso estricto de **Views** y **Queries Parametrizadas** en la capa de datos.
- **Mínimo Privilegio**: Se implementó un rol `app_user` en `05_roles.sql` que **solo** tiene permisos de `SELECT` sobre las vistas de reportes, restringiendo el acceso directo a las tablas base.
- **Gestión de Secretos**: Uso de variables de entorno (`.env`) para manejar la conexión, aislándola del código fuente y proporcionando un `.env.example`.
- **Validación**: Todas las entradas de usuario (filtros, paginación) son validadas con `Zod`.

## Bitácora de IA

- **Prompts Clave**:
    - "Genera 5 vistas complejas en SQL para reportes de una tienda, incluyendo window functions y agregaciones."
    - "Configura un healthcheck en docker-compose para postgresql."
    - "Error getaddrinfo EAI_AGAIN db en Next.js Docker build."
- **Validaciones**:
    - Se verificó que cada vista devuelva el grano correcto.
    - Se validó el estado `healthy` del contenedor con `docker ps`.
- **Correcciones**:
    - Se implementó `force-dynamic` en las rutas de reportes para evitar que Next.js intente conectar a la base de datos durante el tiempo de construcción de la imagen Docker.

## Evidencia de DB: Comando `\dv` (lista de views)

```text
tienda=# \dv
                   List of relations
 Schema |              Name              | Type | Owner
--------+--------------------------------+------+-------
 public | vw_clasificacion_clientes      | view | admin
 public | vw_clientes_top                | view | admin
 public | vw_ordenes_por_status          | view | admin
 public | vw_productos_mas_vendidos      | view | admin
 public | vw_ranking_productos_categoria | view | admin
 public | vw_ventas_por_categoria        | view | admin
(6 rows)
```

