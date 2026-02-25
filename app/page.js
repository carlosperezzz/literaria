'use client'
import { useState, useEffect } from 'react'

const books = [
  { id: 1, title: 'La sombra del viento', author: 'Carlos Ruiz Zafón', color: '#6B3A4A', emoji: '🌑', intensity: 8, mood: 'Para cuando quieres perderte en Barcelona' },
  { id: 2, title: 'Circe', author: 'Madeline Miller', color: '#3A6B4A', emoji: '🌿', intensity: 5, mood: 'Para noches tranquilas y mundos mágicos' },
  { id: 3, title: 'Cien años de soledad', author: 'Gabriel García Márquez', color: '#6B5A2D', emoji: '🦋', intensity: 9, mood: 'El gran viaje que has ido postergando' },
  { id: 4, title: 'Mortal y rosa', author: 'Francisco Umbral', color: '#4A3A6B', emoji: '🌸', intensity: 9, mood: 'Para cuando necesitas llorar sin excusas' },
  { id: 5, title: 'El nombre del viento', author: 'Patrick Rothfuss', color: '#6B4A2D', emoji: '🎵', intensity: 7, mood: 'Ideal para salir de un bloqueo lector' },
  { id: 6, title: 'Persuasión', author: 'Jane Austen', color: '#2D4A6B', emoji: '💛', intensity: 6, mood: 'Para creer en las segundas oportunidades' },
]

const moods = ['Todos', 'Para desconectar', 'Salir del bloqueo', 'Para llorar', 'Adrenalina pura', 'Lectura de metro', 'Para reír']

const botReplies = [
  '¡Buena elección! Déjame buscar en nuestra biblioteca algo perfecto para ti...',
  'Me encanta lo que describes. Tengo justo lo que necesitas entre nuestros libros.',
  'Interesante. Basándome en lo que me cuentas, te recomendaría explorar los libros de abajo 👇',
  'Perfecto, eso me ayuda a entenderte mejor. Echa un vistazo a las sugerencias que aparecen ahora.',
]

export default function Home() {
  const [activeMood, setActiveMood] = useState('Todos')
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Soy Mateo. ¿Qué tipo de lectura estás buscando hoy? Puedes contarme cómo te sientes, cuánto tiempo tienes, si quieres reír o llorar...' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)]
      setMessages(prev => [...prev, { from: 'bot', text: reply }])
      setTyping(false)
    }, 1500)
  }

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: '#F5F0E8', minHeight: '100vh', color: '#1C1917' }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: '#1C1917', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F5F0E8', letterSpacing: '-0.02em' }}>
          Literat<span style={{ color: '#E8845A', fontStyle: 'italic' }}>IA</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Descubrir', 'Mi lista', 'Novedades'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(245,240,232,0.6)', textDecoration: 'none', fontSize: '0.875rem' }}>{l}</a>
          ))}
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '5rem 2rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C2622D', fontWeight: 500, marginBottom: '1rem' }}>Tu librero personal con IA</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 700, marginBottom: '1.5rem' }}>
          El libro que <em style={{ color: '#C2622D' }}>necesitas</em> ahora mismo existe.
        </h1>
        <p style={{ color: '#44403C', fontSize: '1.05rem', maxWidth: 480, lineHeight: 1.7, fontWeight: 300 }}>
          Cuéntanos cómo te sientes y encontramos el libro perfecto. Sin algoritmos fríos. Como una conversación con alguien que ama los libros.
        </p>
      </section>

      {/* CHAT */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 3rem' }}>
        <div style={{ background: '#1C1917', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          {/* Chat header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, background: '#C2622D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📚</div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#F5F0E8', fontWeight: 500 }}>Mateo, tu librero IA</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)' }}>Especialista en literatura en español</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#6EE7A0' }}>
              <div style={{ width: 6, height: 6, background: '#6EE7A0', borderRadius: '50%' }}></div>
              Disponible
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 160 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.from === 'bot' ? '#C2622D' : '#6B7C6E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', flexShrink: 0 }}>
                  {msg.from === 'bot' ? '📚' : 'Tú'}
                </div>
                <div style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: 16, background: msg.from === 'bot' ? 'rgba(255,255,255,0.07)' : '#C2622D', color: msg.from === 'bot' ? '#F5F0E8' : 'white', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#C2622D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>📚</div>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.07)', borderRadius: 16, display: 'flex', gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, background: 'rgba(245,240,232,0.4)', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: `${d}s` }}></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.75rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Cuéntame qué buscas hoy..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.75rem 1rem', color: '#F5F0E8', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
            />
            <button onClick={sendMessage} style={{ background: '#C2622D', border: 'none', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', color: 'white', fontSize: '1rem' }}>→</button>
          </div>
        </div>
      </section>

      {/* SECTION HEADER */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Recomendados para ti</h2>
        <a href="#" style={{ fontSize: '0.8rem', color: '#C2622D', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ver todos →</a>
      </div>

      {/* MOOD FILTERS */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {moods.map(mood => (
          <button key={mood} onClick={() => setActiveMood(mood)} style={{ padding: '0.4rem 0.9rem', borderRadius: 100, fontSize: '0.78rem', cursor: 'pointer', border: '1.5px solid', borderColor: activeMood === mood ? '#1C1917' : 'rgba(28,25,23,0.15)', background: activeMood === mood ? '#1C1917' : 'transparent', color: activeMood === mood ? '#F5F0E8' : '#44403C', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}>
            {mood}
          </button>
        ))}
      </div>

      {/* BOOKS GRID */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
        {books.map(book => (
          <div key={book.id} style={{ cursor: 'pointer', transition: 'transform 0.25s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', background: book.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', position: 'relative' }}>
              <span style={{ fontSize: '2rem' }}>{book.emoji}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: '0.5rem', lineHeight: 1.3 }}>{book.title}</span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: '0.3rem' }}>{book.author}</span>
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#E8D08A', fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: 6 }}>⚡ {book.intensity}/10</div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.2rem' }}>{book.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#44403C', marginBottom: '0.5rem', fontWeight: 300 }}>{book.author}</div>
            <div style={{ fontSize: '0.7rem', color: '#C2622D', fontStyle: 'italic', lineHeight: 1.4 }}>{book.mood}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a:hover { opacity: 0.8; }
        input::placeholder { color: rgba(245,240,232,0.3); }
      `}</style>
    </main>
  )
}
