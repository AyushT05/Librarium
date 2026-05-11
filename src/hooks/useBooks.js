import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setBooks(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const addBook = async (book) => {
    const { data, error } = await supabase.from('books').insert([book]).select()
    if (error) throw error
    setBooks(prev => [data[0], ...prev])
    return data[0]
  }

  const updateBook = async (id, updates) => {
    const { data, error } = await supabase.from('books').update(updates).eq('id', id).select()
    if (error) throw error
    setBooks(prev => prev.map(b => b.id === id ? data[0] : b))
    return data[0]
  }

  const deleteBook = async (id) => {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) throw error
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return { books, loading, error, fetchBooks, addBook, updateBook, deleteBook }
}
