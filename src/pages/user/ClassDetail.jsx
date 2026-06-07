import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
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
      {
        accessorKey: 'rollNo',
        header: '#',
        cell: (info) => (
          <span className="text-xs font-medium text-brand-subtle w-8 inline-block tabular-nums">
            {info.row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => (
          <span className="font-semibold text-brand-dark">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: 'admissionNumber',
        header: 'Adm No.',
        cell: (info) => (
          <span className="text-xs text-brand-muted font-mono">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => {
          const val = Number(info.getValue())
          return (
            <span className={`text-sm font-bold tabular-nums ${val < 0 ? 'text-brand-danger' : 'text-brand-green'}`}>
              {currencyLabel(val)}
            </span>
          )
        },
      },
    ],
    [],
  )

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="relative mx-auto max-w-4xl px-6 py-12 animate-page">
        <GradientBlob className="right-[-4rem] top-0 h-64 w-64 opacity-40" />

        {/* Back + heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-greenTint flex items-center justify-center shadow-sm">
              <Users size={22} className="text-brand-green" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-green mb-0.5">Class Roster</p>
              <h1 className="font-display text-3xl font-extrabold text-brand-dark leading-none">
                {formatClass(code)}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <span className="badge badge-green">{data.length} students</span>
            )}
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
        <div className="card overflow-hidden p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 skeleton rounded-xl" />
              ))}
            </div>
          ) : (
            <StudentTable data={data} columns={columns} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
