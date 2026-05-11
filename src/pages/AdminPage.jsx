import { useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import BookFormModal from '../components/BookFormModal'
import { toast } from '../components/Toast'
import { Plus, Pencil, Trash2, Shield, BookOpen, CheckCircle, XCircle, AlertTriangle, LogOut } from 'lucide-react'

export default function AdminPage() {
  const { books, loading, addBook, updateBook, deleteBook } = useBooks()
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    window.location.reload()
  }

  const handleSave = async (form) => {
    try {
      if (modal && typeof modal === 'object') {
        await updateBook(modal.id, form)
        toast.success('Book updated successfully')
      } else {
        await addBook(form)
        toast.success('Book added successfully')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save book')
      throw err
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      await deleteBook(deleteConfirm.id)
      toast.success('Book deleted')
      setDeleteConfirm(null)
    } catch (err) {
      toast.error(err.message || 'Failed to delete book')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Admin header */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Shield size={18} color="var(--red)" />
            <span className="admin-badge">Admin Panel</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
            Book Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Add, edit, or remove books from the library catalog.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: 'var(--text-muted)' }}>
            <LogOut size={14} /> Lock Admin
          </button>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Book
          </button>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <BookOpen size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{books.length} Total Books</span>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <CheckCircle size={16} color="var(--green)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {books.filter(b => b.available > 0).length} Available
            </span>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <XCircle size={16} color="var(--red)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {books.filter(b => b.available === 0).length} Borrowed
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={40} color="var(--text-muted)" />
            <h3>No books in catalog</h3>
            <p>Click "Add Book" to add your first book to the library.</p>
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              <Plus size={16} /> Add First Book
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => {
                  const isAvailable = book.available > 0
                  return (
                    <tr key={book.id}>
                      <td className="td-primary" style={{ maxWidth: 200 }}>
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {book.title}
                        </div>
                      </td>
                      <td>{book.author}</td>
                      <td>
                        {book.genre && <span className="genre-badge">{book.genre}</span>}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{book.year || '—'}</td>
                      <td>
                        <span style={{ color: isAvailable ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
                          {book.available}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>/{book.copies}</span>
                      </td>
                      <td>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: isAvailable ? 'var(--green-dim)' : 'var(--red-dim)',
                          color: isAvailable ? 'var(--green)' : 'var(--red)',
                          padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600
                        }}>
                          {isAvailable ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {isAvailable ? 'Available' : 'Borrowed'}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={() => setModal(book)}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => setDeleteConfirm(book)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Add/Edit modal */}
      {modal !== null && (
        <BookFormModal
          book={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="var(--red)" />
                <h2 className="modal-title">Confirm Delete</h2>
              </div>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to permanently delete{' '}
                <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  "{deleteConfirm.title}"
                </strong>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                <Trash2 size={14} />
                {deleting ? 'Deleting...' : 'Delete Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
