import { NavLink } from 'react-router-dom'
import { BookOpen, LayoutDashboard, Bot, Shield, Library, BookMarked } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Library size={20} color="var(--accent)" />
          <div>
            <h1>Librarium</h1>
            <span>Management System</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Catalog</div>

        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={16} />
          Overview
        </NavLink>

        <NavLink to="/books" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookOpen size={16} />
          Browse Books
        </NavLink>

        <div className="nav-section-label" style={{ marginTop: 8 }}>Intelligence</div>

        <NavLink to="/ai" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bot size={16} />
          AI Assistant
        </NavLink>

        <div className="nav-section-label" style={{ marginTop: 8 }}>System</div>

        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Shield size={16} />
          Admin Panel
        </NavLink>

        <NavLink to="/admin/reservations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookMarked size={16} />
          Reservations
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          
        </p>
      </div>
    </aside>
  )
}
