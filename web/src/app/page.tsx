import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  PieChart,
  Award,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

const reports = [
  {
    id: 1,
    title: 'Ventas por Categoría',
    description: 'Análisis de ingresos totales agrupados por categoría de producto.',
    icon: BarChart3,
    href: '/reports/1',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 2,
    title: 'Productos Más Vendidos',
    description: 'Ranking de productos con mayor volumen de ventas y nivel de demanda.',
    icon: TrendingUp,
    href: '/reports/2',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 3,
    title: 'Clientes Top',
    description: 'Identificación de clientes con mayor gasto acumulado en la plataforma.',
    icon: Users,
    href: '/reports/3',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-400',
  },
  {
    id: 4,
    title: 'Distribución de Órdenes',
    description: 'Desglose porcentual de órdenes según su estado actual.',
    icon: PieChart,
    href: '/reports/4',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    id: 5,
    title: 'Clasificación de Clientes',
    description: 'Segmentación de usuarios basada en historial de compras y lealtad.',
    icon: Award,
    href: '/reports/5',
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-400',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 pt-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Lab <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reportes</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Panel de control
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.href}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:shadow-xl hover:ring-2 hover:ring-indigo-500 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={clsx(
                  "h-12 w-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg",
                  "bg-gradient-to-br",
                  report.gradient
                )}>
                  <report.icon size={24} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Ver Reporte
                <ArrowRight size={16} className="ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
