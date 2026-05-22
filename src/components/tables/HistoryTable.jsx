import { formatDate, currencyLabel } from '../../lib/formatters'

export default function HistoryTable({ rows = [] }) {
  if (!rows.length) {
    return <p className="rounded-2xl border border-dashed border-brand-border bg-white/60 p-6 text-sm text-brand-muted">No history available for the selected range.</p>
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-border bg-white/80 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-primaryTint/60 text-[11px] uppercase tracking-[0.2em] text-brand-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Coffee</th>
              <th className="px-4 py-3">Tea</th>
              <th className="px-4 py-3">Snack ₹5</th>
              <th className="px-4 py-3">Snack ₹10</th>
              <th className="px-4 py-3">Snack ₹15</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-brand-border/80 text-brand-dark">
                <td className="px-4 py-3 font-semibold">{formatDate(row.date)}</td>
                <td className="px-4 py-3">{row.coffee}</td>
                <td className="px-4 py-3">{row.tea}</td>
                <td className="px-4 py-3">{row.snack5}</td>
                <td className="px-4 py-3">{row.snack10}</td>
                <td className="px-4 py-3">{row.snack15}</td>
                <td className="px-4 py-3 text-right font-bold text-brand-primary">{currencyLabel(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
