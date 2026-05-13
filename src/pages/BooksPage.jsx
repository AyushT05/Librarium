import { useState, useMemo } from 'react'
import { useBooks } from '../hooks/useBooks'
import { useReservations } from '../hooks/useReservations'
import BookDetailModal from '../components/BookDetailModal'
import ReserveModal from '../components/ReserveModal'
import { toast } from '../components/Toast'
import { BookOpen, Search, SlidersHorizontal, BookMarked } from 'lucide-react'

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Science', 'Philosophy', 'Poetry', 'Comics', 'Manga', 'Self-Help', 'Technology', 'Art', 'Travel', 'Cooking', 'Other']

export default function BooksPage() {
  const { books, loading, fetchBooks } = useBooks()
  const { createReservation } = useReservations()
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [availability, setAvailability] = useState('all')
  const [detailBook, setDetailBook] = useState(null)
  const [reserveBook, setReserveBook] = useState(null)

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchSearch = !search ||
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn?.toLowerCase().includes(search.toLowerCase())
      const matchGenre = genre === 'All' || b.genre === genre
      const matchAvail = availability === 'all' ||
        (availability === 'available' && b.available > 0) ||
        (availability === 'borrowed' && b.available === 0)
      return matchSearch && matchGenre && matchAvail
    })
  }, [books, search, genre, availability])

  const handleReserve = async ({ name, phone }) => {
    const result = await createReservation({
      book_id: reserveBook.id,
      borrower_name: name,
      borrower_phone: phone
    })
    toast.success(`"${reserveBook.title}" reserved successfully!`)
    fetchBooks()
    return result
  }

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 6 }}>
          Browse Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {books.length} book{books.length !== 1 ? 's' : ''} in the library &mdash; click Reserve to borrow online
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ width: 300 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Search title, author, ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} color="var(--text-muted)" />
          <div className="filter-tabs">
            {['all', 'available', 'borrowed'].map(a => (
              <button
                key={a}
                className={`filter-tab ${availability === a ? 'active' : ''}`}
                onClick={() => setAvailability(a)}
              >
                {a === 'all' ? 'All' : a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', padding: '8px 14px' }}
          value={genre}
          onChange={e => setGenre(e.target.value)}
        >
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={40} color="var(--text-muted)" />
          <h3>No books found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="books-grid">
            {filtered.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onView={() => setDetailBook(book)}
                onReserve={() => setReserveBook(book)}
              />
            ))}
          </div>
        </>
      )}

      {detailBook && (
        <BookDetailModal book={detailBook} onClose={() => setDetailBook(null)} />
      )}

      {reserveBook && (
        <ReserveModal
          book={reserveBook}
          onClose={() => setReserveBook(null)}
          onConfirm={handleReserve}
        />
      )}
    </div>
  )
}

function BookCard({ book, onView, onReserve }) {
  const isAvailable = book.available > 0
  return (
    <div className="book-card">
      <div className="book-cover" onClick={onView} style={{ cursor: 'pointer' }}>
        <div className="book-cover-pattern" />
        <BookOpen size={36} className="book-cover-icon" />
      </div>
      <div className="book-info">
        <div className="book-title" onClick={onView} style={{ cursor: 'pointer' }}>{book.title}</div>
        <div className="book-author">{book.author}</div>
        {book.year && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.year}</div>}
        <div className="book-meta">
          {book.genre && <span className="genre-badge">{book.genre}</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className={`availability-dot ${isAvailable ? 'available' : 'borrowed'}`} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {book.available}/{book.copies}
            </span>
          </div>
        </div>
        <button
          onClick={onReserve}
          disabled={!isAvailable}
          style={{
            marginTop: 10, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 12px', borderRadius: 'var(--radius)',
            fontSize: '0.8rem', fontWeight: 500, fontFamily: 'var(--font-body)',
            cursor: isAvailable ? 'pointer' : 'not-allowed',
            border: '1px solid', transition: 'all var(--transition)',
            background: isAvailable ? 'var(--accent-dim)' : 'var(--bg-elevated)',
            borderColor: isAvailable ? 'var(--accent-glow)' : 'var(--border)',
            color: isAvailable ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          <BookMarked size={13} />
          {isAvailable ? 'Reserve' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
