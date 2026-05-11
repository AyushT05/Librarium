import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const GENRES = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Science', 'Philosophy', 'Poetry', 'Comics', 'Manga', 'Self-Help', 'Technology', 'Art', 'Travel', 'Cooking', 'Other']

const emptyBook = {
  title: '', author: '', genre: '', isbn: '', year: '', description: '', copies: 1, available: 1
}

export default function BookFormModal({ book, onClose, onSave }) {
  const [form, setForm] = useState(emptyBook)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (book) setForm({ ...emptyBook, ...book })
    else setForm(emptyBook)
  }, [book])

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!form.title || !form.author) return
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Book title" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Author *</label>
            <input className="form-input" placeholder="Author name" value={form.author} onChange={e => set('author', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" value={form.genre} onChange={e => set('genre', e.target.value)}>
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" type="number" placeholder="e.g. 2023" value={form.year} onChange={e => set('year', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input className="form-input" placeholder="ISBN number" value={form.isbn} onChange={e => set('isbn', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Copies</label>
              <input className="form-input" type="number" min="1" value={form.copies} onChange={e => set('copies', parseInt(e.target.value) || 1)} />
            </div>
            <div className="form-group">
              <label className="form-label">Available Copies</label>
              <input className="form-input" type="number" min="0" value={form.available} onChange={e => set('available', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Brief description..." value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.title || !form.author}>
            {saving ? 'Saving...' : (book ? 'Save Changes' : 'Add Book')}
          </button>
        </div>
      </div>
    </div>
  )
}
