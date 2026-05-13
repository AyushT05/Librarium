import { useState } from 'react'
import { X, BookOpen, User, Phone, CheckCircle, MapPin, Clock, AlertCircle } from 'lucide-react'

export default function ReserveModal({ book, onClose, onConfirm }) {
  const [step, setStep] = useState('form') // 'form' | 'success'
  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState(null)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const result = await onConfirm({ name: form.name.trim(), phone: form.phone.trim() })
      setReservation(result)
      setStep('success')
    } catch (err) {
      setErrors({ general: err.message || 'Failed to reserve. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 460 }}>

        {step === 'form' ? (
          <>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Reserve Book</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Fill in your details to reserve this book online
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            {/* Book preview */}
            <div style={{
              margin: '0 24px',
              padding: '14px 16px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              display: 'flex', gap: 12, alignItems: 'center',
              marginTop: 20
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'var(--accent-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <BookOpen size={18} color="var(--accent)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {book.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>by {book.author}</div>
              </div>
              {book.genre && <span className="genre-badge" style={{ marginLeft: 'auto', flexShrink: 0 }}>{book.genre}</span>}
            </div>

            <div className="modal-body" style={{ paddingTop: 20 }}>
              {errors.general && (
                <div style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  background: 'var(--red-dim)', border: '1px solid var(--red)',
                  borderRadius: 'var(--radius)', padding: '10px 14px',
                  color: 'var(--red)', fontSize: '0.85rem'
                }}>
                  <AlertCircle size={15} />
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <User size={11} style={{ display: 'inline', marginRight: 5 }} />
                  Full Name
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. Aditya Kumar"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  autoFocus
                  style={{ borderColor: errors.name ? 'var(--red)' : undefined }}
                />
                {errors.name && <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 3 }}>{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={11} style={{ display: 'inline', marginRight: 5 }} />
                  Phone Number
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  type="tel"
                  style={{ borderColor: errors.phone ? 'var(--red)' : undefined }}
                />
                {errors.phone && <p style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 3 }}>{errors.phone}</p>}
              </div>

              {/* Info note */}
              <div style={{
                background: 'var(--blue-dim)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
                fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <MapPin size={14} color="var(--blue)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    Your reservation will be held for <strong style={{ color: 'var(--text-primary)' }}>48 hours</strong>.
                    Visit the library with your name and phone number to collect the book.
                    The librarian will verify your details at the desk.
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Reserving...' : 'Confirm Reservation'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--green-dim)', border: '2px solid var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckCircle size={30} color="var(--green)" />
              </div>

              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, marginBottom: 6 }}>
                  Reservation Confirmed!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Your book has been reserved successfully.
                </p>
              </div>

              {/* Reservation details card */}
              <div style={{
                width: '100%', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                padding: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{book.title}</span>
                  <span className="genre-badge">Reserved</span>
                </div>
                <InfoRow icon={<User size={13} />} label="Name" value={form.name} />
                <InfoRow icon={<Phone size={13} />} label="Phone" value={form.phone} />
                <InfoRow icon={<Clock size={13} />} label="Held for" value="48 hours from now" />
              </div>

              <div style={{
                background: 'var(--accent-dim)', borderRadius: 'var(--radius)',
                padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)',
                lineHeight: 1.6, textAlign: 'left', width: '100%'
              }}>
                <strong style={{ color: 'var(--accent)' }}>What to do next:</strong> Visit the library and tell the librarian your name and phone number. They will verify your reservation and hand you the book.
              </div>

              <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
      <span style={{ color: 'var(--text-muted)', minWidth: 50 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
