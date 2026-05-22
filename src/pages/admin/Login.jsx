import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.login({ username, password })
      login(response.data.token, response.data.admin)
      toast.success('Logged in successfully')
      navigate('/admin')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md">
        <GradientBlob className="left-[-3rem] top-[-2rem] h-48 w-48" />
        <GradientBlob className="bottom-[-4rem] right-[-2rem] h-52 w-52" />
        <Card className="relative overflow-hidden p-8 shadow-float">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-brand-primaryTint text-brand-primary">
              <KeyRound size={26} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-muted">Admin access</p>
            <h1 className="mt-2 font-display text-4xl font-black text-brand-dark">Teapetti</h1>
            <p className="mt-2 text-sm text-brand-muted">Login to manage students, menu items, and sales.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" autoComplete="username" />
            <InputField label="Password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" type="password" autoComplete="current-password" />

            {error ? <p className="rounded-2xl border border-brand-danger/20 bg-brand-danger/8 px-4 py-3 text-sm font-medium text-brand-danger">{error}</p> : null}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => {
                setUsername('')
                setPassword('')
                setError('')
              }}>
                <Trash2 size={14} />
                Clear
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
