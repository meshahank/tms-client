import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import { useClasses } from '../../hooks/useClasses'
import { formatClass } from '../../lib/formatters'

export default function Classes() {
  const { data: classes = [], isLoading } = useClasses()

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 text-center">
        <GradientBlob className="left-[-6rem] top-0 h-72 w-72 opacity-60" />
        <GradientBlob className="right-[-5rem] bottom-0 h-64 w-64 opacity-40" amber />

        <div className="relative mx-auto max-w-xl px-6 animate-page">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-3">Browse All</p>
          <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] font-extrabold leading-[0.9] text-brand-dark mb-4">
            Classes
          </h1>
          <p className="text-base text-brand-muted max-w-sm mx-auto leading-relaxed">
            Select a class to view the student list and individual balances.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-stagger">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 skeleton rounded-2xl" />
              ))
            : classes.map((cls) => (
                <Link
                  key={cls._id ?? cls.name}
                  to={`/classes/${encodeURIComponent(cls.name ?? cls)}`}
                  className="group card card-hover flex flex-col items-center justify-center gap-3 py-8 text-center"
                >
                  <div className="h-12 w-12 rounded-2xl bg-brand-greenTint flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <Users size={20} className="text-brand-green" />
                  </div>
                  <p className="font-semibold text-brand-dark">{formatClass(cls.name ?? cls)}</p>
                  {cls.studentCount != null && (
                    <p className="text-[11px] text-brand-subtle">{cls.studentCount} students</p>
                  )}
                </Link>
              ))}
        </div>

        {!isLoading && classes.length === 0 && (
          <div className="py-20 text-center text-sm text-brand-subtle">No classes found.</div>
        )}
      </section>

      <Footer />
    </div>
  )
}
