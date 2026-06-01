import { useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import { CLASS_CODES } from '../../lib/constants'

export default function Classes() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="relative mx-auto max-w-6xl px-6 py-12">
        <GradientBlob className="left-[-4rem] top-0 h-64 w-64 opacity-40" />
        <GradientBlob className="right-[-3rem] bottom-0 h-56 w-56 opacity-30" />

        <div className="relative">
          <h1 className="font-display text-5xl font-black text-brand-dark mb-8">Classes</h1>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CLASS_CODES.map((code) => (
              <button
                key={code}
                onClick={() => navigate(`/classes/${code}`)}
                className="group relative overflow-hidden rounded-[1.4rem] bg-white border border-black/[0.07] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-28 flex flex-col justify-between p-4"
              >
                {/* Subtle orange corner accent */}
                <div className="absolute right-0 top-0 h-14 w-14 rounded-bl-[2rem] bg-gradient-to-br from-brand-primaryTint to-transparent opacity-70" />
                <p className="font-display text-3xl font-black text-brand-dark leading-none">{code}</p>
                <div className="h-[3px] w-10 rounded-full bg-gradient-to-r from-brand-primarySoft to-brand-primary transition-all duration-300 group-hover:w-14" />
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
