import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { CLASS_CODES } from '../../lib/constants'

export default function Classes() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Classes</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">Select a class to inspect the roster</h1>
            </div>
            <Badge>12 groups</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {CLASS_CODES.map((classCode) => (
              <Card
                key={classCode}
                className="group cursor-pointer p-4 transition duration-300 hover:-translate-y-1 hover:shadow-float"
                onClick={() => navigate(`/classes/${classCode}`)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-black text-brand-dark">{classCode}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">Open roster</p>
                  </div>
                  <ChevronRight size={18} className="text-brand-primary transition group-hover:translate-x-0.5" />
                </div>
                <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-brand-primarySoft via-brand-primary to-brand-primary/40" />
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
