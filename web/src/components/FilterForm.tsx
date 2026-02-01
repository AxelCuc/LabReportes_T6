'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface FilterFormProps {
    label: string;
    paramName: string;
    placeholder?: string;
    type?: 'text' | 'number';
}

export function FilterForm({ label, paramName, placeholder, type = 'text' }: FilterFormProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(paramName, term);
        } else {
            params.delete(paramName);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={paramName} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <input
                id={paramName}
                type={type}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow shadow-sm"
                placeholder={placeholder}
                defaultValue={searchParams.get(paramName)?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}
