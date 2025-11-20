import Chat from './components/Chat'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex flex-col items-center justify-start p-8 gap-8">
        {/* Header */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="/flame-icon.svg"
              alt="Flames"
              className="w-16 h-16 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Flames Blue · Dummy Chat
          </h1>

          <p className="text-base md:text-lg text-blue-200">
            A lightweight, playful ChatGPT-style demo you can talk to
          </p>
        </div>

        {/* Chat panel */}
        <Chat />

        {/* Footer */}
        <div className="text-center">
          <a
            href="/test"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-blue-100 border border-white/10 transition"
          >
            Backend & database check
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
