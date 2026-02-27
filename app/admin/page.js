'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '../lib/supabase'

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [errorAuth, setErrorAuth] = useState('')
  const [pendientes, setPendientes] = useState([])
  const [libros, setLibros] = useState([])
  const [nuevosTitulos, setNuevosTitulos] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    if (autenticado) {
      cargarDatos()
    }
  }, [autenticado])

  async function login() {
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    if (data.ok) {
      setAutenticado(true)
      setErrorAuth('')
    } else {
      setErrorAuth('Contrasena incorrecta')
    }
  }

  async function cargarDatos() {
    const supabase = getSupabase()
    const { data: p } = await supabase.from('libros_pendientes').select('*').order('created_at', { ascending: false })
    const { data: l } = await supabase.from('libros').select('*').order('created_at', { ascending: false })
    setPendientes(p || [])
    setLibros(l || [])
  }

  async function añadirTitulos() {
    const titulos = nuevosTitulos.split('\n').map(t => t.trim()).filter(t => t.length > 0)
    if (titulos.length === 0) return

    const supabase = getSupabase()
    const inserts = titulos.map(titulo => ({ titulo, procesado: false }))
    const { error } = await supabase.from('libros_pendientes').insert(inserts)

    if (!error) {
      setMensaje(`${titulos.length} titulos añadidos`)
      setNuevosTitulos('')
      cargarDatos()
    } else {
      setMensaje('Error: ' + error.message)
    }
  }

  async function procesarLibros() {
    setProcesando(true)
    setMensaje('Procesando...')
    const res = await fetch('/api/procesar-libros')
    const data = await res.json()
    setMensaje(data.mensaje)
    setProcesando(false)
    cargarDatos()
  }

  async function eliminarLibro(id) {
    const supabase = getSupabase()
    await supabase.from('libros').delete().eq('id', id)
    cargarDatos()
  }

  if (!autenticado) {
    return (
      <main style={{ fontFamily: 'Inter, sans-serif', maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>Admin LiteratIA</h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Contrasena"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
        />
        {errorAuth && <p style={{ color: 'red', marginBottom: '12px' }}>{errorAuth}</p>}
        <button onClick={login} style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}>
          Entrar
        </button>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Admin LiteratIA</h1>
        <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Ver web</a>
      </div>

      {mensaje && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#166534' }}>
          {mensaje}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Añadir libros pendientes</h2>
          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>Un titulo por linea</p>
          <textarea
            value={nuevosTitulos}
            onChange={e => setNuevosTitulos(e.target.value)}
            placeholder={'La asistenta\nHabitos atomicos\n1984'}
            style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <button onClick={añadirTitulos} style={{ marginTop: '10px', background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
            Añadir
          </button>
        </div>

        <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Procesar libros pendientes</h2>
          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>Busca datos en Google Books y los añade a la biblioteca</p>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 20px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a1a1a' }}>{pendientes.filter(p => !p.procesado).length}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Pendientes</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '12px 20px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a1a1a' }}>{libros.length}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>En biblioteca</div>
            </div>
          </div>
          <button onClick={procesarLibros} disabled={procesando} style={{ background: procesando ? '#888' : '#1a1a1a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: procesando ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
            {procesando ? 'Procesando...' : 'Procesar 5 libros'}
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Biblioteca ({libros.length} libros)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {libros.map(libro => (
          <div key={libro.id} style={{ background: '#f9f9f9', borderRadius: '10px', overflow: 'hidden' }}>
            {libro.portada_url && <img src={libro.portada_url} alt={libro.titulo} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
            <div style={{ padding: '10px' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>{libro.titulo}</p>
              <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px' }}>{libro.autor}</p>
              <button onClick={() => eliminarLibro(libro.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
