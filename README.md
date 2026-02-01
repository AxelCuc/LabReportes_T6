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

## Detalles Técnicos y Seguridad

-   **Framework**: Next.js 15 (App Router).
-   **Estilos**: Tailwind CSS con diseño "Premium" (Inter font, gradients, cards).
-   **BD Client**: `pg` (node-postgres) con patrón Singleton.
-   **Seguridad**:
    -   Consultas parametrizadas (`$1`, `$2`) para prevenir SQL Injection.
    -   Validación de inputs con `zod`.
    -   Credenciales de BD seguras en docker-compose (environment variables).
    -   Uso exclusivo de Server Components para data fetching (sin exposición de API keys).
