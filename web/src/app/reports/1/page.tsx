import pool from '@/lib/db';
import { Views, Report1Data } from '@/lib/definitions';
import { DataTable } from '@/components/DataTable';
import { KPICard } from '@/components/KPICard';
import { DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensure no caching for latest data

export default async function Report1Page() {
    const result = await pool.query(`SELECT * FROM ${Views.Report1}`);
    const data: Report1Data[] = result.rows;

    // Calculate KPI: Total Global Sales
    const totalSales = data.reduce((acc, curr) => acc + Number(curr.total_ventas), 0);

    const formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalSales);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ventas por Categoría</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Desglose de ingresos generados por cada categoría de productos.
                    </p>
                </div>

                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KPICard
                        title="Ventas Totales"
                        value={formattedTotal}
                        icon={DollarSign}
                        color="bg-emerald-500"
                    />
                </div>

                {/* Table Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Detalle</h2>
                    <DataTable<Report1Data>
                        data={data}
                        keyField="categoria_id"
                        columns={[
                            { header: 'ID', accessorKey: 'categoria_id' },
                            { header: 'Categoría', accessorKey: 'categoria' },
                            {
                                header: 'Total Ventas',
                                accessorKey: 'total_ventas',
                                format: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val))
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
