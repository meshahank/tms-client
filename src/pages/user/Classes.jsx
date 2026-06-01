import { useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import GradientBlob from '../../components/ui/GradientBlob'
import { CLASS_CODES } from '../../lib/constants'

export default function Classes() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-[-3rem] top-[-2rem] h-48 w-48" />
          <GradientBlob className="right-[-2rem] bottom-[-3rem] h-56 w-56" />
          
          <div className="relative space-y-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Classes</p>
              <h1 className="mt-2 font-display text-4xl font-black text-brand-dark">Select a class to view roster</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {CLASS_CODES.map((classCode) => (
                <Card
                  key={classCode}
                  className="group relative cursor-pointer overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-float"
                  onClick={() => navigate(`/classes/${classCode}`)}
                >
                  <div className="flex h-32 flex-col justify-between p-5">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] bg-gradient-to-br from-brand-primaryTint to-transparent" />
                    <p className="font-display text-4xl font-black text-brand-dark">{classCode}</p>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-primarySoft via-brand-primary to-brand-primary/40 transition-all group-hover:w-24" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
