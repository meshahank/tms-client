import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import GradientBlob from '../../components/ui/GradientBlob'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ username, password })
      login(res.data.token, res.data.admin)
      toast.success('Logged in successfully')
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <GradientBlob className="left-[-4rem] top-[-3rem] h-56 w-56 opacity-50" />
        <GradientBlob className="right-[-3rem] bottom-[-4rem] h-52 w-52 opacity-40" />

        <div className="relative rounded-[1.75rem] bg-white border border-black/[0.07] shadow-float p-8">
          <div className="mb-7 text-center">
            <h1 className="font-display text-3xl font-black text-brand-dark">
              <span className="text-brand-primary">Tea</span>petti
            </h1>
            <p className="mt-1.5 text-sm text-brand-muted">Admin — sign in to manage the shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wider">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-dark/70 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
              />
            </div>

            {error && (
              <p className="rounded-2xl bg-brand-danger/8 border border-brand-danger/15 px-4 py-2.5 text-sm text-brand-danger font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
