import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const toastState = { listeners: [] }
let toastId = 0

export function toast(message, type = 'info') {
  const id = ++toastId
  toastState.listeners.forEach(fn => fn({ id, message, type }))
}

toast.success = (msg) => toast(msg, 'success')
toast.error = (msg) => toast(msg, 'error')
toast.info = (msg) => toast(msg, 'info')

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500)
    }
    toastState.listeners.push(handler)
    return () => { toastState.listeners = toastState.listeners.filter(fn => fn !== handler) }
  }, [])

  const icons = {
    success: <CheckCircle size={16} color="var(--green)" />,
    error: <XCircle size={16} color="var(--red)" />,
    info: <Info size={16} color="var(--blue)" />
  }

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {icons[t.type]}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            className="btn-icon btn-ghost"
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
