import { z } from 'zod';

// Report 1: Ventas por Categoria
export const Report1Schema = z.object({
    categoria_id: z.number(),
    categoria: z.string(),
    total_ventas: z.coerce.number(), // pg returns numerics as strings often
});
export type Report1Data = z.infer<typeof Report1Schema>;

// Report 2: Productos Mas Vendidos
export const Report2Schema = z.object({
    producto_id: z.number(),
    producto: z.string(),
    unidades_vendidas: z.coerce.number(),
    nivel_venta: z.string(),
});
export type Report2Data = z.infer<typeof Report2Schema>;

// Report 3: Clientes Top
export const Report3Schema = z.object({
    usuario_id: z.number(),
    usuario: z.string(),
    gasto_total: z.coerce.number(),
});
export type Report3Data = z.infer<typeof Report3Schema>;

// Report 4: Ordenes por Status
export const Report4Schema = z.object({
    status: z.string(),
    total_ordenes: z.coerce.number(),
    porcentaje_total: z.coerce.number(),
});
export type Report4Data = z.infer<typeof Report4Schema>;

// Report 5: Clasificacion Clientes
export const Report5Schema = z.object({
    usuario_id: z.number(),
    usuario: z.string(),
    gasto_total: z.coerce.number(),
    nivel_cliente: z.string(),
});
export type Report5Data = z.infer<typeof Report5Schema>;

// Listing Views
export const Views = {
    Report1: 'vw_ventas_por_categoria',
    Report2: 'vw_productos_mas_vendidos',
    Report3: 'vw_clientes_top',
    Report4: 'vw_ordenes_por_status',
    Report5: 'vw_clasificacion_clientes',
} as const;
