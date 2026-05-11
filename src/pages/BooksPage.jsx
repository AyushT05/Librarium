import { useState, useMemo } from 'react'
import { useBooks } from '../hooks/useBooks'
import BookDetailModal from '../components/BookDetailModal'
import { BookOpen, Search, Filter, SlidersHorizontal } from 'lucide-react'

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Science', 'Philosophy', 'Poetry', 'Comics', 'Manga', 'Self-Help', 'Technology', 'Art', 'Travel', 'Cooking', 'Other']

export default function BooksPage() {
  const { books, loading } = useBooks()
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('All')
  const [availability, setAvailability] = useState('all')
  const [selectedBook, setSelectedBook] = useState(null)

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

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 6 }}>
          Browse Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {books.length} book{books.length !== 1 ? 's' : ''} in the library
        </p>
      </div>

      {/* Filters */}
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
              <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
            ))}
          </div>
        </>
      )}

      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}

function BookCard({ book, onClick }) {
  const isAvailable = book.available > 0
  return (
    <div className="book-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="book-cover">
        <div className="book-cover-pattern" />
        <BookOpen size={36} className="book-cover-icon" />
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
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
      </div>
    </div>
  )
}
