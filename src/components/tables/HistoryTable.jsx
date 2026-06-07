import { formatDate, currencyLabel } from '../../lib/formatters'

export default function HistoryTable({ rows = [] }) {
  if (!rows.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-brand-subtle">No history for the selected period.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-base w-full">
        <thead>
          <tr>
            {['Date', 'Coffee', 'Tea', '₹5', '₹10', '₹15', 'Total'].map((h) => (
              <th key={h} className={h === 'Total' ? 'text-right' : ''}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="font-medium text-brand-dark whitespace-nowrap">{formatDate(row.date)}</td>
              <td className="text-brand-mid">{row.coffee}</td>
              <td className="text-brand-mid">{row.tea}</td>
              <td className="text-brand-mid">{row.snack5}</td>
              <td className="text-brand-mid">{row.snack10}</td>
              <td className="text-brand-mid">{row.snack15}</td>
              <td className="text-right font-semibold text-brand-green">{currencyLabel(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
