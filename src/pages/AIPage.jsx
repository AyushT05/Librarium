import { useState, useRef, useEffect } from 'react'
import { useBooks } from '../hooks/useBooks'
import { queryGemini } from '../lib/gemini'
import { Bot, User, Send, Sparkles, RefreshCw } from 'lucide-react'

const SUGGESTIONS = [
  'How many books are available?',
  'Which genres do we have?',
  'Suggest a mystery novel',
  'How many unique authors are there?',
  'What are the most recent books?',
  'List all science fiction books',
]

export default function AIPage() {
  const { books } = useBooks()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your library AI assistant powered by Gemini. I have full access to the library catalog and can help you find books, suggest recommendations, or answer any questions about the collection. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const response = await queryGemini(msg, books)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I help you with the library catalog?"
    }])
  }

  return (
    <div className="page-content" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, marginBottom: 4 }}>
            AI Assistant
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Ask questions about the catalog, get book recommendations, explore the collection.
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearChat}>
          <RefreshCw size={14} /> Clear chat
        </button>
      </div>

      <div className="ai-chat-container" style={{ flex: 1, minHeight: 0 }}>
        <div className="ai-chat-header">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Librarium AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {books.length} books in catalog
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
           
          </div>
        </div>

        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ${msg.role}`}>
              <div className={`ai-avatar ${msg.role}`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="ai-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="ai-message assistant">
              <div className="ai-avatar assistant"><Bot size={16} /></div>
              <div className="ai-bubble">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="suggestion-chips">
          {SUGGESTIONS.map(s => (
            <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="ai-input-area">
          <textarea
            className="ai-input"
            placeholder="Ask about books, genres, authors, recommendations..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="btn btn-primary"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{ flexShrink: 0 }}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
