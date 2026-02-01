import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Tailwind bg class for icon 'bg-blue-500'
}

export function KPICard({ title, value, icon: Icon, trend, trendUp, color = 'bg-indigo-500' }: KPICardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
                </div>
                <div className={clsx("p-3 rounded-lg text-white shadow-md", color)}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={clsx(
                        "font-medium",
                        trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                        {trend}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
                </div>
            )}
        </div>
    );
}
