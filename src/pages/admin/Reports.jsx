import { useState } from 'react'
import { Download, Calendar, FileSpreadsheet, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import InputField from '../../components/ui/InputField'
import ItemSalesChart from '../../components/ui/ItemSalesChart'
import { useItemAnalytics } from '../../hooks/useItemAnalytics'
import { salesApi } from '../../api/sales'

export default function Reports() {
  const [dateRange, setDateRange]         = useState({ from: '', to: '' })
  const [analyticsRange, setAnalyticsRange] = useState('week')
  const [exporting, setExporting]         = useState(false)

  const { data: analytics, isLoading: analyticsLoading } = useItemAnalytics(analyticsRange)

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) { toast.error('Select both start and end dates'); return }
    setExporting(true)
    try {
      const response = await salesApi.exportReport(dateRange.from, dateRange.to)
      const url = URL.createObjectURL(response.data)
      const a   = document.createElement('a')
      a.href = url
      a.download = `Teapetti_report_${dateRange.from}_to_${dateRange.to}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report exported!')
    } catch {
      toast.error('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-page space-y-6">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-1.5">Reports</p>
          <h1 className="font-display text-4xl font-extrabold text-brand-dark">Sales Reports</h1>
        </div>

        {/* Export card */}
        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-brand-greenTint flex items-center justify-center">
              <FileSpreadsheet size={18} className="text-brand-green" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-green mb-0.5">Excel Export</p>
              <h2 className="font-display text-xl font-extrabold text-brand-dark">Generate Report</h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <InputField
              label="Start Date"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))}
              prefix={<Calendar size={14} />}
            />
            <InputField
              label="End Date"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))}
              prefix={<Calendar size={14} />}
            />
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn btn-primary h-[42px] shrink-0 disabled:opacity-50"
            >
              <Download size={14} />
              {exporting ? 'Exporting…' : 'Export'}
            </button>
          </div>

          <div className="rounded-xl bg-brand-greenTint/50 px-4 py-3">
            <p className="text-xs text-brand-mid leading-relaxed">
              Exported Excel includes <strong>Summary</strong>, <strong>Per-Class Spending</strong>, and <strong>Item Breakdown</strong> sheets covering all transactions in the selected range.
            </p>
          </div>
        </div>

        {/* Analytics card */}
        <div className="card space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-brand-greenTint flex items-center justify-center">
                <BarChart3 size={18} className="text-brand-green" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-green mb-0.5">Analytics</p>
                <h2 className="font-display text-xl font-extrabold text-brand-dark">Item Sales</h2>
              </div>
            </div>
            <div className="flex gap-1.5">
              {['week', 'month'].map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsRange(r)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    analyticsRange === r
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-brand-greenTint text-brand-mid hover:bg-brand-greenMid'
                  }`}
                >
                  {r === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          <ItemSalesChart data={analytics} isLoading={analyticsLoading} range={analyticsRange} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
