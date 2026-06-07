import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react'

export default function StudentTable({ data = [], columns = [] }) {
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="table-base w-full">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                return (
                  <th key={header.id} className="px-4 py-3 text-left">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[11px] font-700 uppercase tracking-widest text-brand-muted hover:text-brand-green transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === 'asc' ? (
                          <ChevronUp size={10} className="text-brand-green" />
                        ) : sorted === 'desc' ? (
                          <ChevronDown size={10} className="text-brand-green" />
                        ) : (
                          <ChevronsUpDown size={10} className="opacity-30" />
                        )}
                      </button>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!data.length && (
        <div className="py-12 text-center text-sm text-brand-subtle">No records found</div>
      )}
    </div>
  )
}
