import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`*, books(title, author, genre)`)
        .order('created_at', { ascending: false })
      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  const createReservation = async ({ book_id, borrower_name, borrower_phone }) => {
    // 1. Insert reservation
    const { data, error } = await supabase
      .from('reservations')
      .insert([{ book_id, borrower_name, borrower_phone, status: 'pending' }])
      .select(`*, books(title, author, genre)`)
    if (error) throw error

    // 2. Decrement available count
    const { error: bookError } = await supabase.rpc('decrement_available', { book_id })
    if (bookError) throw bookError

    setReservations(prev => [data[0], ...prev])
    return data[0]
  }

  const updateStatus = async (id, status) => {
    const reservation = reservations.find(r => r.id === id)

    const { data, error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`*, books(title, author, genre)`)
    if (error) throw error

    // If cancelled, restore available count
    if (status === 'cancelled' && reservation?.status === 'pending') {
      await supabase.rpc('increment_available', { book_id: reservation.book_id })
    }

    setReservations(prev => prev.map(r => r.id === id ? data[0] : r))
    return data[0]
  }

  return { reservations, loading, error, fetchReservations, createReservation, updateStatus }
}
