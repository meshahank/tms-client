import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import GradientBlob from '../../components/ui/GradientBlob'
import StudentTable from '../../components/tables/StudentTable'
import { useClassStudents } from '../../hooks/useClassStudents'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function ClassDetail() {
  const { code } = useParams()
  const { data = [], isLoading } = useClassStudents(code)

  const columns = useMemo(
    () => [
      { accessorKey: 'rollNo', header: 'No.', cell: (info) => info.row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
      { accessorKey: 'admissionNumber', header: 'Ad no', cell: (info) => <span className="text-brand-muted">{info.getValue()}</span> },
      {
        accessorKey: 'balance',
        header: 'Mess',
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
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-8">
          <GradientBlob className="right-[-3rem] top-[-2rem] h-48 w-48" />
          
          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primaryTint">
                  <span className="font-display text-2xl font-black text-brand-primary">{formatClass(code)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Class Roster</p>
                  <h1 className="font-display text-3xl font-black text-brand-dark">{formatClass(code)}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-brand-primaryTint px-4 py-2 text-sm font-semibold text-brand-dark">
                  <Users size={14} className="text-brand-primary" />
                  {data.length} students
                </div>
                <Link to="/classes">
                  <Button variant="secondary" size="sm">
                    <ArrowLeft size={14} />
                    All classes
                  </Button>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Card className="p-10 text-center text-brand-muted">Loading class roster...</Card>
            ) : (
              <StudentTable data={data} columns={columns} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
