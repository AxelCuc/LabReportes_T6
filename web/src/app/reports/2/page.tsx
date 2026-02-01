import pool from '@/lib/db';
import { Views, Report2Data } from '@/lib/definitions';
import { DataTable } from '@/components/DataTable';
import { KPICard } from '@/components/KPICard';
import { Pagination } from '@/components/Pagination';
import { TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Report2Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 5;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // Parallel data fetching: Total Count + Paginated Data
    const countPromise = pool.query(`SELECT COUNT(*) FROM ${Views.Report2}`);
    const dataPromise = pool.query(
        `SELECT * FROM ${Views.Report2} LIMIT $1 OFFSET $2`,
        [ITEMS_PER_PAGE, offset]
    );

    const [countResult, dataResult] = await Promise.all([countPromise, dataPromise]);

    const totalItems = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const data: Report2Data[] = dataResult.rows;

    // KPI: Best Selling Product (Top 1 globally, independent of page)
    const bestSellerResult = await pool.query(`SELECT * FROM ${Views.Report2} ORDER BY unidades_vendidas DESC LIMIT 1`);
    const bestSeller = bestSellerResult.rows[0];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productos Más Vendidos</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Catálogo de productos ordenados por volumen de ventas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bestSeller && (
                        <KPICard
                            title="Producto Top"
                            value={bestSeller.producto}
                            icon={TrendingUp}
                            color="bg-amber-500"
                        />
                    )}
                    {bestSeller && (
                        <KPICard
                            title="Unidades (Top)"
                            value={bestSeller.unidades_vendidas}
                            icon={TrendingUp}
                            color="bg-amber-500"
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <DataTable<Report2Data>
                        data={data}
                        keyField="producto_id"
                        columns={[
                            { header: 'ID', accessorKey: 'producto_id' },
                            { header: 'Producto', accessorKey: 'producto' },
                            { header: 'Unidades Vendidas', accessorKey: 'unidades_vendidas' },
                            { header: 'Nivel Venta', accessorKey: 'nivel_venta' },
                        ]}
                    />
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
