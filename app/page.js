'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from './lib/supabase'

export default function Home() {
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [mensaje, setMensaje] = useState('')
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
    setTimeout(() => {
      setChat(prev => [...prev, { rol: 'mateo', texto: 'Buscando algo perfecto para ti...' }])
    }, 1000)
  }

  const estados = ['todos', 'feliz', 'reflexivo', 'misterio', 'aventura']

  return (
    <main style={{ fontFamily: 'Georgia, serif', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2c1810' }}>LiteratIA</h1>
        <p style={{ color: '#666' }}>Tu librero personal con inteligencia artificial</p>
      </header>

      <div style={{ background: '#fdf6e3', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c1810', marginBottom: '15px' }}>Habla con Mateo</h2>
        <div style={{ minHeight: '100px', marginBottom: '15px' }}>
          {chat.map((m, i) => (
            <div key={i} style={{ marginBottom: '10px', textAlign: m.rol === 'usuario' ? 'right' : 'left' }}>
              <span style={{
                background: m.rol === 'usuario' ? '#2c1810' : '#fff',
                color: m.rol === 'usuario' ? '#fff' : '#2c1810',
                padding: '8px 14px', borderRadius: '18px', display: 'inline-block'
              }}>
                {m.texto}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe aqui..."
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button onClick={enviarMensaje} style={{
            background: '#2c1810', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
          }}>Enviar</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {estados.map(e => (
          <button key={e} onClick={() => setFiltro(e)} style={{
            background: filtro === e ? '#2c1810' : '#fdf6e3',
            color: filtro === e ? '#fff' : '#2c1810',
            border: '1px solid #2c1810', padding: '8px 16px',
            borderRadius: '20px', cursor: 'pointer', textTransform: 'capitalize'
          }}>{e}</button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando libros...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {libros.map(libro => (
            <div key={libro.id} style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={libro.portada_url} alt={libro.titulo} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', color: '#2c1810', marginBottom: '4px' }}>{libro.titulo}</h3>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>{libro.autor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}