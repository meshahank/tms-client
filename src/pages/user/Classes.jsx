import { Link } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import { CLASS_CODES } from '../../lib/constants'

export default function Classes() {
  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="relative mx-auto max-w-5xl px-6 pt-14 pb-20">
        <GradientBlob className="left-[-8rem] top-[-4rem] h-96 w-96 opacity-50" />
        <GradientBlob className="right-[-6rem] bottom-0 h-72 w-72 opacity-35" amber />

        <div className="relative animate-page">
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-brand-dark mb-10">
            Classes
          </h1>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CLASS_CODES.map((code) => (
              <Link
                key={code}
                to={`/classes/${encodeURIComponent(code)}`}
                className="group card card-hover flex flex-col justify-between p-4 h-28"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-subtle">
                  Class
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-dark leading-none group-hover:text-brand-green transition-colors">
                    {code}
                  </p>
                  <p className="text-[10px] text-brand-muted mt-1">View roster</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
