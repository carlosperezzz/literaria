export async function GET(request) {
  const { getSupabase } = await import('../../lib/supabase')
  const supabase = getSupabase()

  // Coger hasta 5 libros pendientes
  const { data: pendientes, error } = await supabase
    .from('libros_pendientes')
    .select('*')
    .eq('procesado', false)
    .limit(5)

  if (error || !pendientes || pendientes.length === 0) {
    return Response.json({ mensaje: 'No hay libros pendientes', procesados: 0 })
  }

  let procesados = 0

  for (const libro of pendientes) {
    try {
      // Buscar en Google Books
      const query = encodeURIComponent(libro.titulo)
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=es&maxResults=1`)
      const data = await res.json()

      if (data.items && data.items[0]) {
        const info = data.items[0].volumeInfo
        const portada = info.imageLinks?.thumbnail?.replace('http://', 'https://') || ''
        const autor = info.authors?.[0] || 'Desconocido'
        const descripcion = info.description?.slice(0, 500) || ''
        const genero = info.categories?.[0] || 'Ficcion'

        // Insertar en libros
        await supabase.from('libros').insert({
          titulo: info.title || libro.titulo,
          autor,
          genero,
          descripcion,
          portada_url: portada,
          estado_animo: 'reflexivo'
        })

        // Marcar como procesado
        await supabase
          .from('libros_pendientes')
          .update({ procesado: true })
          .eq('id', libro.id)

        procesados++
      }
    } catch (e) {
      console.error('Error procesando:', libro.titulo, e)
    }
  }

  return Response.json({ mensaje: `Procesados ${procesados} libros`, procesados })
}
