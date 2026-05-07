import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  isMono?: boolean;
  className?: string;
}

interface DataLedgerTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyStateMessage?: string;
}

export function DataLedgerTable<T>({
  data,
  columns,
  keyExtractor,
  emptyStateMessage = "No data found.",
}: DataLedgerTableProps<T>) {
  return (
    <div className="rounded-sm border border-border bg-black">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span className="text-muted-foreground font-mono text-xs">{emptyStateMessage}</span>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns.map((col, i) => {
                  let content: React.ReactNode;
                  if (col.cell) {
                    content = col.cell(item);
                  } else if (col.accessorKey) {
                    content = item[col.accessorKey] as React.ReactNode;
                  }

                  return (
                    <TableCell 
                      key={i} 
                      className={col.isMono ? "font-mono text-muted-foreground" : ""}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
