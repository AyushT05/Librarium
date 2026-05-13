import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Database, Copy, CheckCircle } from 'lucide-react'

const SQL = `-- Books table
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  genre text,
  isbn text,
  year integer,
  description text,
  copies integer default 1,
  available integer default 1,
  created_at timestamptz default now()
);

-- Reservations table
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  book_id uuid references books(id) on delete cascade,
  borrower_name text not null,
  borrower_phone text not null,
  status text default 'pending' check (status in ('pending','collected','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RPC: decrement available copies
create or replace function decrement_available(book_id uuid)
returns void as $$
  update books set available = available - 1 where id = book_id and available > 0;
$$ language sql;

-- RPC: increment available copies
create or replace function increment_available(book_id uuid)
returns void as $$
  update books set available = available + 1 where id = book_id;
$$ language sql;

-- RLS policies
alter table books enable row level security;
alter table reservations enable row level security;
create policy "Allow all books" on books for all using (true) with check (true);
create policy "Allow all reservations" on reservations for all using (true) with check (true);`

export default function SetupPage({ onSetupComplete }) {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkConnection = async () => {
    setChecking(true)
    const { error } = await supabase.from('books').select('count').limit(1)
    if (!error) onSetupComplete()
    else alert('Table not found yet. Run the SQL in Supabase first.')
    setChecking(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{ maxWidth: 640, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Database size={28} color="var(--accent)" />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>Database Setup Required</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Run this SQL in your Supabase project to get started.</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>supabase_setup.sql</span>
            <button className="btn btn-ghost btn-sm" onClick={copy}>
              {copied ? <><CheckCircle size={13} color="var(--green)" /> Copied</> : <><Copy size={13} /> Copy SQL</>}
            </button>
          </div>
          <pre style={{ padding: 20, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.7, overflow: 'auto', maxHeight: 360 }}>
            {SQL}
          </pre>
        </div>

        <ol style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 20, marginBottom: 24, lineHeight: 2 }}>
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to <strong style={{ color: 'var(--text-primary)' }}>SQL Editor</strong></li>
          <li>Paste and run the SQL above</li>
          <li>Click the button below to verify</li>
        </ol>

        <button className="btn btn-primary" onClick={checkConnection} disabled={checking} style={{ width: '100%', justifyContent: 'center' }}>
          {checking ? 'Checking...' : 'Check Connection & Continue'}
        </button>
      </div>
    </div>
  )
}
