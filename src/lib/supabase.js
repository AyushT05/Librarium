import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize the books table if it doesn't exist via RPC or direct queries
export async function initializeDatabase() {
  // Try to query - if table doesn't exist, we'll handle it
  const { error } = await supabase.from('books').select('count').limit(1)
  return !error
}
