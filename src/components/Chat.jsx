import { useEffect, useRef, useState } from 'react'

const MessageBubble = ({ role, content }) => {
  const isAssistant = role === 'assistant'
  return (
    <div className={`w-full flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow/10 shadow-black/5 whitespace-pre-wrap ${
          isAssistant
            ? 'bg-white/80 backdrop-blur text-slate-800 border border-slate-200'
            : 'bg-blue-600 text-white'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm a lightweight demo assistant. Ask me anything." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollerRef = useRef(null)

  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
  }, [messages])

  const sendMessage = async (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${backendBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()

      const reply = data?.reply || 'Sorry, I could not generate a response right now.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `There was a problem reaching the server. ${String(err)}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-[80vh] bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/90 shadow-blue-500/40 shadow-md" />
          <div>
            <p className="text-white font-semibold">Dummy Chat</p>
            <p className="text-xs text-blue-200/70">Powered by a playful server echo</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-xs text-blue-200/80 animate-pulse px-2">Assistant is typing…</div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={sendMessage} className="p-3 md:p-4 border-t border-white/10 bg-slate-800/60">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            className="flex-1 resize-none rounded-2xl bg-white/90 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 px-4 py-3 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium shadow-md"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
