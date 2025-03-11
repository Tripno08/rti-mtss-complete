import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  className,
  emptyMessage = "Nenhum dado encontrado",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className={cn(
      "rounded-lg border border-stroke bg-white shadow-sm dark:border-stroke-dark dark:bg-gray-dark",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-stroke bg-gray-50 dark:border-stroke-dark dark:bg-gray-800">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-innerview-primary border-t-transparent"></div>
                    <span className="ml-2">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-3 text-sm text-gray-700 dark:text-gray-300",
                        column.className
                      )}
                    >
                      {column.cell ? column.cell(item) : String(item[column.accessor] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 