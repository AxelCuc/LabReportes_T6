import pool from '@/lib/db';
import { Views, Report3Schema, Report3Data } from '@/lib/definitions';
import { DataTable } from '@/components/DataTable';
import { KPICard } from '@/components/KPICard';
import { FilterForm } from '@/components/FilterForm';
import { Users } from 'lucide-react';
import { z } from 'zod';

const SearchSchema = z.object({
    min_spend: z.coerce.number().optional().default(0),
});

export const dynamic = 'force-dynamic';

export default async function Report3Page({
    searchParams,
}: {
    searchParams?: {
        min_spend?: string;
    };
}) {
    // 1. Zod Validation of Input
    const parsedParams = SearchSchema.safeParse(searchParams);

    // Fallback to default if validation fails (security/stability)
    const minSpend = parsedParams.success ? parsedParams.data.min_spend : 0;

    // 2. Parameterized Query
    // Note: View already filters > 500. We add an additional filter.
    // Using parameterized query $1 to prevent SQL Injection.
    const result = await pool.query(
        `SELECT * FROM ${Views.Report3} WHERE gasto_total >= $1 ORDER BY gasto_total DESC`,
        [minSpend]
    );

    const data: Report3Data[] = result.rows;

    // KPI: Top Spender in this filtered set
    const topSpender = data.length > 0 ? data[0] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clientes Top</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Listado de clientes con mayor volumen de compras acumulado.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topSpender && (
                        <KPICard
                            title="Mayor Gasto (Filtrado)"
                            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(topSpender.gasto_total)}
                            icon={Users}
                            color="bg-indigo-500"
                        />
                    )}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col justify-center">
                        <FilterForm
                            label="Gasto Mínimo ($)"
                            paramName="min_spend"
                            type="number"
                            placeholder="Ej. 1000"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <DataTable<Report3Data>
                        data={data}
                        keyField="usuario_id"
                        columns={[
                            { header: 'ID', accessorKey: 'usuario_id' },
                            { header: 'Usuario', accessorKey: 'usuario' },
                            {
                                header: 'Gasto Total',
                                accessorKey: 'gasto_total',
                                format: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val))
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
