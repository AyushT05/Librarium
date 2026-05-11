import { useMemo } from 'react'
import { useBooks } from '../hooks/useBooks'
import { Link } from 'react-router-dom'
import { BookOpen, Users, BookMarked, TrendingUp, ArrowRight, Tag } from 'lucide-react'

export default function Dashboard() {
  const { books, loading } = useBooks()

  const stats = useMemo(() => {
    const total = books.length
    const available = books.filter(b => b.available > 0).length
    const borrowed = books.filter(b => b.available === 0).length
    const authors = new Set(books.map(b => b.author)).size
    const genres = books.reduce((acc, b) => {
      if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1
      return acc
    }, {})
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]
    return { total, available, borrowed, authors, genres, topGenre }
  }, [books])

  const recentBooks = books.slice(0, 6)

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 6 }}>
          Library Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          A complete view of your library catalog and statistics.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Books</span>
            <div className="stat-icon" style={{ background: 'var(--accent-dim)' }}>
              <BookOpen size={16} color="var(--accent)" />
            </div>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">Titles in catalog</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Available</span>
            <div className="stat-icon" style={{ background: 'var(--green-dim)' }}>
              <BookMarked size={16} color="var(--green)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.available}</div>
          <div className="stat-sub">Ready to borrow</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Borrowed</span>
            <div className="stat-icon" style={{ background: 'var(--red-dim)' }}>
              <TrendingUp size={16} color="var(--red)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{stats.borrowed}</div>
          <div className="stat-sub">Currently out</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Authors</span>
            <div className="stat-icon" style={{ background: 'var(--blue-dim)' }}>
              <Users size={16} color="var(--blue)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{stats.authors}</div>
          <div className="stat-sub">Unique contributors</div>
        </div>
      </div>

      {/* Genre breakdown */}
      {Object.keys(stats.genres).length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="section-header">
            <h2 className="section-title">
              <Tag size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Genre Breakdown
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {Object.entries(stats.genres).sort((a, b) => b[1] - a[1]).map(([genre, count]) => (
              <div key={genre} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{genre}</span>
                <span style={{
                  background: 'var(--accent-dim)', color: 'var(--accent)',
                  borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600
                }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent books */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          <Link to="/books" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recentBooks.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={40} color="var(--text-muted)" />
            <h3>No books yet</h3>
            <p>Start by adding books in the Admin Panel.</p>
          </div>
        ) : (
          <div className="books-grid">
            {recentBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookCard({ book }) {
  const isAvailable = book.available > 0
  return (
    <div className="book-card">
      <div className="book-cover">
        <div className="book-cover-pattern" />
        <BookOpen size={36} className="book-cover-icon" />
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
        <div className="book-meta">
          {book.genre && <span className="genre-badge">{book.genre}</span>}
          <div className={`availability-dot ${isAvailable ? 'available' : 'borrowed'}`} title={isAvailable ? 'Available' : 'Borrowed'} />
        </div>
      </div>
    </div>
  )
}
