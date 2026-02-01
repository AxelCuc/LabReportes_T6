import pool from '@/lib/db';
import { Views, Report5Data } from '@/lib/definitions';
import { DataTable } from '@/components/DataTable';
import { Pagination } from '@/components/Pagination';
import { Award } from 'lucide-react';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function Report5Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const ITEMS_PER_PAGE = 5;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const countPromise = pool.query(`SELECT COUNT(*) FROM ${Views.Report5}`);
    const dataPromise = pool.query(
        `SELECT * FROM ${Views.Report5} ORDER BY gasto_total DESC LIMIT $1 OFFSET $2`,
        [ITEMS_PER_PAGE, offset]
    );

    const [countResult, dataResult] = await Promise.all([countPromise, dataPromise]);

    const totalItems = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const data: Report5Data[] = dataResult.rows;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clasificación de Clientes</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Segmentación de clientes basada en su nivel de consumo.
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 p-4 rounded-lg flex items-start">
                    <Award className="text-pink-500 mt-1 mr-3 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-pink-900 dark:text-pink-100">Niveles de Cliente</h4>
                        <p className="text-sm text-pink-800 dark:text-pink-200 mt-1">
                            Premium ({'>'} $1000), Regular ({'>'} $500), Básico (Otros).
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <DataTable<Report5Data>
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
                            {
                                header: 'Nivel',
                                accessorKey: 'nivel_cliente',
                                format: (val) => (
                                    <span className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-semibold",
                                        val === 'Premium' ? "bg-purple-100 text-purple-700" :
                                            val === 'Regular' ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                    )}>
                                        {val}
                                    </span>
                                )
                            },
                        ]}
                    />
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
