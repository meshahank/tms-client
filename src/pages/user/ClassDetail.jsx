import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import StudentTable from '../../components/tables/StudentTable'
import { useClassStudents } from '../../hooks/useClassStudents'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function ClassDetail() {
  const { code } = useParams()
  const { data = [], isLoading } = useClassStudents(code)

  const columns = useMemo(
    () => [
      { accessorKey: 'rollNo', header: 'No.', cell: (info) => <span className="text-brand-muted text-xs">{info.row.index + 1}</span> },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-medium text-brand-dark">{info.getValue()}</span> },
      { accessorKey: 'admissionNumber', header: 'Ad no', cell: (info) => <span className="text-brand-muted text-sm">{info.getValue()}</span> },
      {
        accessorKey: 'balance',
        header: 'Mess',
        cell: (info) => (
          <span className={`text-sm font-semibold ${Number(info.getValue()) < 0 ? 'text-brand-danger' : 'text-brand-dark'}`}>
            {currencyLabel(info.getValue())}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="relative mx-auto max-w-5xl px-6 py-12">
        <GradientBlob className="right-[-3rem] top-0 h-56 w-56 opacity-35" />

        <div className="relative">
          {/* Back + heading row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-[1rem] bg-brand-primaryTint">
                <span className="font-display text-lg font-black text-brand-primary">{formatClass(code)}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-brand-primary">Class Roster</p>
                <h1 className="font-display text-3xl font-black text-brand-dark leading-none">{formatClass(code)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-brand-muted bg-brand-primaryTint rounded-full px-3 py-1.5">
                {data.length} students
              </span>
              <Link
                to="/classes"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-dark transition-colors"
              >
                <ArrowLeft size={14} />
                All classes
              </Link>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-[1.4rem] bg-white border border-black/[0.07] shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="p-10 text-center text-sm text-brand-muted">Loading class roster...</div>
            ) : (
              <StudentTable data={data} columns={columns} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
