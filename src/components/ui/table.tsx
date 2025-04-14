
import React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    cell?: (value: any, row: T) => React.ReactNode;
  }[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-muted/50">
            {columns.map((column, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-muted/50">
              {columns.map((column, j) => {
                const accessor = column.accessor;
                const value = typeof accessor === "function" 
                  ? accessor(row) 
                  : row[accessor];
                
                return (
                  <td key={j} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.cell ? column.cell(value, row) : value}
                  </td>
                );
              })}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-muted-foreground"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
