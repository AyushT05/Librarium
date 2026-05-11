import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { ToastContainer } from './components/Toast'
import AdminGate from './components/AdminGate'
import Dashboard from './pages/Dashboard'
import BooksPage from './pages/BooksPage'
import AIPage from './pages/AIPage'
import AdminPage from './pages/AdminPage'
import SetupPage from './pages/SetupPage'
import { supabase } from './lib/supabase'
import { ThemeProvider, useTheme } from './lib/theme.jsx'
import { Sun, Moon } from 'lucide-react'
import './index.css'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ color: 'var(--text-secondary)' }}
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
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
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h2 className="topbar-title">{titles[location.pathname] || 'Librarium'}</h2>
          <ThemeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />
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
