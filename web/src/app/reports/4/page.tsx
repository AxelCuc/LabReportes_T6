import pool from '@/lib/db';
import { Views, Report4Data } from '@/lib/definitions';
import { DataTable } from '@/components/DataTable';
import { FilterForm } from '@/components/FilterForm';
import { PieChart } from 'lucide-react';
import { z } from 'zod';
import clsx from 'clsx';

const SearchSchema = z.object({
    status: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export default async function Report4Page({
    searchParams,
}: {
    searchParams?: {
        status?: string;
    };
}) {
    const parsedParams = SearchSchema.safeParse(searchParams);
    const statusFilter = parsedParams.success ? parsedParams.data.status : undefined;

    let query = `SELECT * FROM ${Views.Report4}`;
    const params: any[] = [];

    if (statusFilter) {
        query += ` WHERE status ILIKE $1`; // Case insensitive search
        params.push(`%${statusFilter}%`);
    }

    // Whitelist/Sanity check on simple ordering (optional but good practice)
    query += ` ORDER BY porcentaje_total DESC`;

    const result = await pool.query(query, params);
    const data: Report4Data[] = result.rows;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Distribución de Órdenes</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Estado actual de las órdenes en el sistema.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Chart Section */}
                    <div className="md:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 flex items-center">
                            <PieChart className="mr-2 text-orange-500" size={20} />
                            Visualización Gráfica
                        </h3>
                        <div className="space-y-4">
                            {data.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.status}</span>
                                        <span className="text-slate-500">{item.porcentaje_total}% ({item.total_ordenes})</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={clsx("h-2.5 rounded-full",
                                                idx % 3 === 0 ? "bg-orange-500" :
                                                    idx % 3 === 1 ? "bg-blue-500" :
                                                        "bg-emerald-500"
                                            )}
                                            style={{ width: `${item.porcentaje_total}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {data.length === 0 && <p className="text-slate-500 text-sm">No data to display.</p>}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 h-fit">
                        <FilterForm
                            label="Filtrar por Status"
                            paramName="status"
                            placeholder="Ej. Entregado"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <DataTable<Report4Data>
                        data={data}
                        columns={[
                            { header: 'Status', accessorKey: 'status' },
                            { header: 'Total Órdenes', accessorKey: 'total_ordenes' },
                            { header: '% del Total', accessorKey: 'porcentaje_total', format: v => `${v}%` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
