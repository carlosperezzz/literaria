'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [mensaje, setMensaje] = useState('')
  const [chat, setChat] = useState([
    { rol: 'mateo', texto: '¡Hola! Soy Mateo, tu librero IA. ¿Qué tipo de libro buscas hoy?' }
  ])

  useEffect(() => {
    cargarLibros()
  }, [filtro])

  async function cargarLibros() {
    setLoading(true)
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
      setChat(prev => [...prev, { rol: 'mateo', texto: 'Déjame buscar algo
