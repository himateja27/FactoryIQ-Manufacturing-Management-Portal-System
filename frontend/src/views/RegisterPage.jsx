import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'customer',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/api/auth/register/', form)
      navigate('/login', { replace: true })
    } catch (err) {
      const data = err?.response?.data
      setError(typeof data === 'string' ? data : JSON.stringify(data || 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card">
        <h1 className="title">Register</h1>
        <p className="subtitle">Create your FactoryIQ account</p>

        {error ? <div className="alert">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <div className="grid2">
            <label className="label">
              First name
              <input className="input" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
            </label>
            <label className="label">
              Last name
              <input className="input" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
            </label>
          </div>
          <label className="label">
            Username
            <input className="input" value={form.username} onChange={(e) => update('username', e.target.value)} required />
          </label>
          <label className="label">
            Email
            <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </label>
          <label className="label">
            Role
            <select className="input" value={form.role} onChange={(e) => update('role', e.target.value)}>
              <option value="customer">Customer</option>
              <option value="engineer">Engineer</option>
              <option value="quality">Quality</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="label">
            Password (min 8 chars)
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

