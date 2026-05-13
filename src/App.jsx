import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { ToastContainer } from './components/Toast'
import AdminGate from './components/AdminGate'
import Dashboard from './pages/Dashboard'
import BooksPage from './pages/BooksPage'
import AIPage from './pages/AIPage'
import AdminPage from './pages/AdminPage'
import ReservationsPage from './pages/ReservationsPage'
import SetupPage from './pages/SetupPage'
import { supabase } from './lib/supabase'
import { ThemeProvider, useTheme } from './lib/theme.jsx'
import { Sun, Moon } from 'lucide-react'
import './index.css'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 14px', borderRadius: 'var(--radius)',
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        color: 'var(--text-secondary)', fontSize: '0.8rem',
        fontFamily: 'var(--font-body)', cursor: 'pointer',
        transition: 'all var(--transition)', whiteSpace: 'nowrap',
      }}
    >
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

function AppShell() {
  const location = useLocation()

  const titles = {
    '/': 'Overview',
    '/books': 'Browse Catalog',
    '/ai': 'AI Assistant',
    '/admin': 'Admin Panel',
    '/admin/reservations': 'Reservations',
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h2 className="topbar-title">{titles[location.pathname] || 'Librarium'}</h2>
          <div style={{ marginLeft: 'auto' }}>
            <ThemeToggle />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />
          <Route path="/admin/reservations" element={<AdminGate><ReservationsPage /></AdminGate>} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  )
}

export default function App() {
  const [dbReady, setDbReady] = useState(null)

  useEffect(() => {
    supabase.from('books').select('count').limit(1).then(({ error }) => {
      setDbReady(!error)
    })
  }, [])

  if (dbReady === null) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!dbReady) {
    return <SetupPage onSetupComplete={() => setDbReady(true)} />
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
