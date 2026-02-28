import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: pendientes, error } = await supabase
    .from('libros_pendientes')
    .select('*')
    .eq('procesado', false)
    .limit(5)

  if (error) return Response.json({ error: error.message })
  if (!pendientes || pendientes.length === 0) return Response.json({ mensaje: 'No hay libros pendientes', procesados: 0 })

  let procesados = 0

  for (const libro of pendientes) {
    try {
      const query = encodeURIComponent(libro.titulo)
      
      // 1. Buscar en Open Library
      const olRes = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=3`)
      const olData = await olRes.json()
      
      let titulo = libro.titulo
      let autor = 'Desconocido'
      let descripcion = ''
      let genero = 'Ficcion'
      let portada = ''

      if (olData.docs && olData.docs.length > 0) {
        const doc = olData.docs[0]
        titulo = doc.title || libro.titulo
        autor = doc.author_name?.[0] || 'Desconocido'
        descripcion = doc.first_sentence?.[0] || ''
        genero = doc.subject?.[0] || 'Ficcion'
        if (doc.cover_i) {
          portada = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        }
      }

      // 2. Si no hay portada, intentar con Google Books
      if (!portada) {
        try {
          const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`)
          const gbData = await gbRes.json()
          if (gbData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
            portada = gbData.items[0].volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')
            // Si tampoco teníamos descripción, la tomamos de Google Books
            if (!descripcion && gbData.items[0].volumeInfo.description) {
              descripcion = gbData.items[0].volumeInfo.description.slice(0, 500)
            }
          }
        } catch (e) {}
      }

      await supabase.from('libros').insert({
        titulo,
        autor,
        genero,
        descripcion,
        portada_url: portada,
        estado_animo: 'reflexivo'
      })

      await supabase
        .from('libros_pendientes')
        .update({ procesado: true })
        .eq('id', libro.id)

      procesados++

    } catch (e) {
      console.error('Error:', e)
    }
  }

  return Response.json({ mensaje: `Procesados ${procesados} libros`, procesados })
}
