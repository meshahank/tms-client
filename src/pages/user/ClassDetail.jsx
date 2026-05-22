import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StudentTable from '../../components/tables/StudentTable'
import { useClassStudents } from '../../hooks/useClassStudents'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function ClassDetail() {
  const { code } = useParams()
  const { data = [], isLoading } = useClassStudents(code)

  const columns = useMemo(
    () => [
      { accessorKey: 'rollNo', header: 'Roll No', cell: (info) => info.row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
      { accessorKey: 'admissionNumber', header: 'Adm. No' },
      { accessorKey: 'class', header: 'Class', cell: (info) => <Badge>{formatClass(info.getValue())}</Badge> },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => (
          <span className={Number(info.getValue()) < 0 ? 'font-bold text-brand-danger' : 'font-bold text-brand-dark'}>
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Class Detail</p>
            <h1 className="font-display text-4xl font-black text-brand-dark">{formatClass(code)}</h1>
          </div>
          <Link to="/classes">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Back to classes
            </Button>
          </Link>
        </div>

        <Card className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-muted">Roster snapshot</p>
            <h2 className="mt-1 font-display text-2xl font-black text-brand-dark">Students in {formatClass(code)}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-primaryTint px-4 py-2 text-sm font-semibold text-brand-dark">
            <Users size={14} className="text-brand-primary" />
            {data.length} students
          </div>
        </Card>

        {isLoading ? (
          <Card className="p-10 text-center text-brand-muted">Loading class roster...</Card>
        ) : (
          <StudentTable data={data} columns={columns} />
        )}
      </main>
      <Footer />
    </div>
  )
}
