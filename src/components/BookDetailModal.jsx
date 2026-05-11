import { BookOpen, X, User, Tag, Calendar, Hash, Copy, CheckCircle } from 'lucide-react'

export default function BookDetailModal({ book, onClose }) {
  if (!book) return null
  const isAvailable = book.available > 0

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Book Details</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="book-detail-cover">
            <div className="book-cover-pattern" style={{
              background: `repeating-linear-gradient(45deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 14px)`,
              opacity: 0.07
            }} />
            <BookOpen size={48} color="var(--accent)" style={{ opacity: 0.5, position: 'relative', zIndex: 1 }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, marginBottom: 4 }}>{book.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>by {book.author}</p>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            {book.genre && <span className="genre-badge">{book.genre}</span>}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: isAvailable ? 'var(--green-dim)' : 'var(--red-dim)',
              color: isAvailable ? 'var(--green)' : 'var(--red)',
              padding: '3px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              {isAvailable ? <CheckCircle size={11} /> : <X size={11} />}
              {isAvailable ? 'Available' : 'Borrowed'}
            </span>
          </div>

          <div className="book-detail-info">
            {book.year && <div className="detail-row"><span className="detail-label"><Calendar size={13} style={{display:'inline', marginRight:4}} />Year</span><span className="detail-value">{book.year}</span></div>}
            {book.isbn && <div className="detail-row"><span className="detail-label"><Hash size={13} style={{display:'inline', marginRight:4}} />ISBN</span><span className="detail-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{book.isbn}</span></div>}
            <div className="detail-row">
              <span className="detail-label"><Copy size={13} style={{display:'inline', marginRight:4}} />Copies</span>
              <span className="detail-value">{book.available} of {book.copies} available</span>
            </div>
            {book.description && (
              <div style={{ marginTop: 4 }}>
                <div className="detail-label" style={{ marginBottom: 8 }}>Description</div>
                <p className="description-text">{book.description}</p>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
