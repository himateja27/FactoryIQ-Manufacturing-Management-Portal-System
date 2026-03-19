import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { api } from '../lib/api'
import { setAccessToken } from '../lib/auth'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const nextPath = useMemo(() => location.state?.from || '/dashboard', [location.state])
  const { refreshUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/token/', { username, password })
      setAccessToken(res.data.access)
      await refreshUser()
      navigate(nextPath, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card">
        <h1 className="title">Login</h1>
        <p className="subtitle">Sign in to FactoryIQ</p>

        {error ? <div className="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Username
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="muted">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

