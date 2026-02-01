'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center space-x-6 mt-8">
            <Link
                href={createPageURL(currentPage - 1)}
                className={clsx(
                    "flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm",
                    currentPage <= 1 && "pointer-events-none opacity-50"
                )}
            >
                <ChevronLeft size={16} className="mr-1" />
                Previous
            </Link>

            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Page <span className="text-slate-900 dark:text-white font-bold">{currentPage}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalPages}</span>
            </span>

            <Link
                href={createPageURL(currentPage + 1)}
                className={clsx(
                    "flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm",
                    currentPage >= totalPages && "pointer-events-none opacity-50"
                )}
            >
                Next
                <ChevronRight size={16} className="ml-1" />
            </Link>
        </div>
    );
}
