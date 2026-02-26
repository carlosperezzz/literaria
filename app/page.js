'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from './lib/supabase'

export default function Home() {
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [mensaje, setMensaje] = useState('')
  const [libroSeleccionado, setLibroSeleccionado] = useState(null)
  const [chat, setChat] = useState([
    { rol: 'mateo', texto: 'Hola! Soy Mateo, tu librero IA. Que tipo de libro buscas hoy?' }
  ])

  useEffect(() => {
    cargarLibros()
  }, [filtro])

  async function cargarLibros() {
    setLoading(true)
    const supabase = getSupabase()
    let query = supabase.from('libros').select('*')
    if (filtro !== 'todos') {
      query = query.eq('estado_animo', filtro)
    }
    const { data, error } = await query
    if (!error) setLibros(data)
    setLoading(false)
  }

  async function enviarMensaje() {
    if (!mensaje.trim()) return
    const nuevoChat = [...chat, { rol: 'usuario', texto: mensaje }]
    setChat(nuevoChat)
    setMensaje('')
    setChat(prev => [...prev, { rol: 'mateo', texto: 'Pensando...' }])

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    })
    const data = await response.json()

    setChat(prev => {
      const nuevo = [...prev]
      nuevo[nuevo.length - 1] = { rol: 'mateo', texto: data.respuesta }
      return nuevo
    })
  }

  const estados = ['todos', 'feliz', 'reflexivo', 'misterio', 'aventura']

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1100px', margin: '0 auto', padding: '20px', background: '#fff', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '8px' }}>LiteratIA</h1>
        <p style={{ color: '#888', fontSize: '1rem' }}>Tu librero personal con inteligencia artificial</p>
      </header>

      {/* CHAT ESTILO WHATSAPP */}
      <div style={{ background: '#e5ddd5', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#075e54', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📚</div>
          <div>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: '1rem' }}>Mateo</div>
            <div style={{ color: '#b2dfdb', fontSize: '0.75rem' }}>Tu librero IA</div>
          </div>
        </div>

        <div style={{ padding: '20px', minHeight: '200px', maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }}>
          {chat.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.rol === 'usuario' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                background: m.rol === 'usuario' ? '#dcf8c6' : '#fff',
                padding: '10px 14px',
                borderRadius: m.rol === 'usuario' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '75%',
                fontSize: '0.9rem',
                color: '#1a1a1a',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                lineHeight: '1.4'
              }}>
                {m.texto}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0f0f0', padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe un mensaje..."
            style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: 'none', outline: 'none', fontSize: '0.95rem', background: '#fff' }}
          />
          <button onClick={enviarMensaje} style={{
            width: '44px', height: '44px', borderRadius: '50%', background: '#075e54',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
          }}>➤</button>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {estados.map(e => (
          <button key={e} onClick={() => setFiltro(e)} style={{
            background: filtro === e ? '#1a1a1a' : '#fff',
            color: filtro === e ? '#fff' : '#1a1a1a',
            border: '1.5px solid #1a1a1a', padding: '8px 20px',
            borderRadius: '24px', cursor: 'pointer', textTransform: 'capitalize',
            fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s'
          }}>{e}</button>
        ))}
      </div>

      {/* GRID DE LIBROS */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Cargando libros...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {libros.map(libro => (
            <div key={libro.id} onClick={() => setLibroSeleccionado(libro)} style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', background: '#fff' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              <img src={libro.portada_url} alt={libro.titulo} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{libro.titulo}</h3>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{libro.autor}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FICHA DE LIBRO */}
      {libroSeleccionado && (
        <div onClick={() => setLibroSeleccionado(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', maxWidth: '600px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', gap: '0' }}>
              <img src={libroSeleccionado.portada_url} alt={libroSeleccionado.titulo} style={{ width: '180px', minHeight: '280px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: '28px', flex: 1 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '6px' }}>{libroSeleccionado.titulo}</h2>
                <p style={{ color: '#555', fontWeight: '500', marginBottom: '4px' }}>{libroSeleccionado.autor}</p>
                <span style={{ display: 'inline-block', background: '#f0f0f0', color: '#555', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '16px' }}>{libroSeleccionado.genero}</span>
                <p style={{ color: '#444', lineHeight: '1.6', fontSize: '0.9rem' }}>{libroSeleccionado.descripcion}</p>
              </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
              <button onClick={() => setLibroSeleccionado(null)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '24px', cursor: 'pointer', fontWeight: '600' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}