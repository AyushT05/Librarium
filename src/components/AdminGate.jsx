import { useState } from 'react'
import { Shield, Eye, EyeOff, Lock } from 'lucide-react'

// Change this to whatever password you want
const ADMIN_PASSWORD = 'admin123'

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === 'true')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  if (authed) return children

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg-primary)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 28px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-tertiary)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: 14,
            background: 'var(--red-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <Shield size={24} color="var(--red)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: 4 }}>
            Admin Access
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This area is restricted. Enter the admin password to continue.
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">
              <Lock size={11} style={{ display: 'inline', marginRight: 5 }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                autoFocus
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center'
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p style={{ fontSize: '0.78rem', color: 'var(--red)', marginTop: 4 }}>
                {error}
              </p>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleLogin}
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={!password}
          >
            <Shield size={15} />
            Access Admin Panel
          </button>
        </div>
      </div>
    </div>
  )
}
