import { useState } from 'react'
import { useReservations } from '../hooks/useReservations'
import { toast } from '../components/Toast'
import {
  BookMarked, User, Phone, Clock, CheckCircle,
  XCircle, Search, Filter, RefreshCw, PackageCheck
} from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'var(--accent)',  bg: 'var(--accent-dim)',  icon: <Clock size={11} /> },
  collected: { label: 'Collected', color: 'var(--green)',   bg: 'var(--green-dim)',   icon: <CheckCircle size={11} /> },
  cancelled: { label: 'Cancelled', color: 'var(--red)',     bg: 'var(--red-dim)',     icon: <XCircle size={11} /> },
}

export default function ReservationsPage() {
  const { reservations, loading, fetchReservations, updateStatus } = useReservations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  const filtered = reservations.filter(r => {
    const matchSearch = !search ||
      r.borrower_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.borrower_phone?.includes(search) ||
      r.books?.title?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (id, status, label) => {
    setUpdating(id)
    try {
      await updateStatus(id, status)
      toast.success(`Reservation marked as ${label}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    collected: reservations.filter(r => r.status === 'collected').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: 4 }}>
            Reservations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage book reservations and verify borrowers at the desk.
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchReservations}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { key: 'all',       label: 'Total',     color: 'var(--blue)',   bg: 'var(--blue-dim)' },
          { key: 'pending',   label: 'Pending',   color: 'var(--accent)', bg: 'var(--accent-dim)' },
          { key: 'collected', label: 'Collected', color: 'var(--green)',  bg: 'var(--green-dim)' },
          { key: 'cancelled', label: 'Cancelled', color: 'var(--red)',    bg: 'var(--red-dim)' },
        ].map(({ key, label, color, bg }) => (
          <div key={key} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '16px 20px',
            cursor: 'pointer',
            borderLeft: statusFilter === key ? `3px solid ${color}` : undefined,
          }} onClick={() => setStatusFilter(key)}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, color }}>{counts[key]}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div className="search-bar" style={{ width: 280 }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Search name, phone, book..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'collected', 'cancelled'].map(s => (
            <button
              key={s}
              className={`filter-tab ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <BookMarked size={40} color="var(--text-muted)" />
          <h3>No reservations found</h3>
          <p>{statusFilter !== 'all' ? 'Try a different filter.' : 'Reservations will appear here when users reserve books.'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Phone</th>
                <th>Reserved On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending
                const isUpdating = updating === r.id
                const date = new Date(r.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {r.books?.title || 'Unknown'}
                      </div>
                      {r.books?.author && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {r.books.author}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={13} color="var(--text-muted)" />
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.borrower_name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        <Phone size={12} color="var(--text-muted)" />
                        {r.borrower_phone}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{date}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: cfg.bg, color: cfg.color,
                        padding: '3px 10px', borderRadius: 4,
                        fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em'
                      }}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {r.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-sm"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, 'collected', 'Collected')}
                              style={{
                                background: 'var(--green-dim)', color: 'var(--green)',
                                border: '1px solid transparent', display: 'flex', alignItems: 'center', gap: 5
                              }}
                            >
                              <PackageCheck size={13} />
                              {isUpdating ? '...' : 'Mark Collected'}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(r.id, 'cancelled', 'Cancelled')}
                            >
                              <XCircle size={13} />
                              {isUpdating ? '...' : 'Cancel'}
                            </button>
                          </>
                        )}
                        {r.status !== 'pending' && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No actions
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
