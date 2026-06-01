import { useState } from 'react'
import { Download, Calendar, FileSpreadsheet, TrendingUp, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import { useItemAnalytics } from '../../hooks/useItemAnalytics'
import { currencyLabel } from '../../lib/formatters'
import { salesApi } from '../../api/sales'

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [analyticsRange, setAnalyticsRange] = useState('week')
  const [exporting, setExporting] = useState(false)

  const { data: analytics, isLoading: analyticsLoading } = useItemAnalytics(analyticsRange)

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select both start and end dates')
      return
    }

    setExporting(true)
    try {
      const response = await salesApi.exportReport(dateRange.from, dateRange.to)
      const blobUrl = URL.createObjectURL(response.data)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = `Teapetti_report_${dateRange.from}_to_${dateRange.to}.xlsx`
      anchor.click()
      URL.revokeObjectURL(blobUrl)
      toast.success('Report exported successfully')
    } catch {
      toast.error('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Reports</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">Sales reports and analytics export</h1>
            </div>
          </div>

          <Card className="space-y-6 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                <FileSpreadsheet size={20} />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Export Sales Report</p>
                <h2 className="font-display text-2xl font-black text-brand-dark">Generate Excel report</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <InputField
                label="Start date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                prefix={<Calendar size={14} />}
              />
              <InputField
                label="End date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                prefix={<Calendar size={14} />}
              />
              <Button onClick={handleExport} disabled={exporting}>
                <Download size={14} />
                {exporting ? 'Exporting...' : 'Export Report'}
              </Button>
            </div>

            <Card className="bg-brand-primaryTint/40 p-4">
              <p className="text-sm text-brand-muted">
                The exported Excel file includes Summary, Per-Class Spending, and Item Breakdown sheets with all transaction data in the selected date range.
              </p>
            </Card>
          </Card>

          <Card className="space-y-6 p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                  <BarChart3 size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Item Analytics</p>
                  <h2 className="font-display text-2xl font-black text-brand-dark">Sales by item</h2>
                </div>
              </div>
              <div className="flex gap-2">
                {['week', 'month'].map((range) => (
                  <Button
                    key={range}
                    variant={analyticsRange === range ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setAnalyticsRange(range)}
                  >
                    {range === 'week' ? 'This Week' : 'This Month'}
                  </Button>
                ))}
              </div>
            </div>

            {analyticsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="animate-pulse bg-white/60 p-5">
                    <div className="h-4 w-20 rounded bg-brand-primaryTint" />
                    <div className="mt-4 h-8 w-16 rounded bg-brand-primaryTint" />
                  </Card>
                ))}
              </div>
            ) : analytics?.items?.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.items.map((item, index) => (
                  <Card key={index} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">{item.name}</p>
                        <p className="mt-3 text-3xl font-black text-brand-dark">{item.count}</p>
                        <p className="mt-1 text-sm text-brand-muted">{currencyLabel(item.revenue)} revenue</p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primaryTint text-brand-primary">
                        <TrendingUp size={16} />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed p-8 text-center text-brand-muted">
                No analytics data available for the selected period.
              </Card>
            )}

            {analytics?.totalRevenue !== undefined && (
              <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-gradient-to-r from-brand-primaryTint via-white to-brand-primaryTint p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total Revenue</p>
                  <p className="mt-2 text-3xl font-black text-brand-primary">{currencyLabel(analytics.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total Transactions</p>
                  <p className="mt-2 text-3xl font-black text-brand-dark">{analytics.totalTransactions ?? 0}</p>
                </div>
              </div>
            )}
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}
