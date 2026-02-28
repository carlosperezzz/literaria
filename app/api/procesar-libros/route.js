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
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}&lang=spa&limit=3`)
      const data = await res.json()

      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0]
        const coverId = doc.cover_i
        const portada = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : ''
        const autor = doc.author_name?.[0] || 'Desconocido'
        const descripcion = doc.first_sentence?.[0] || doc.subject?.[0] || ''
        const genero = doc.subject?.[0] || 'Ficcion'

        await supabase.from('libros').insert({
          titulo: doc.title || libro.titulo,
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
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  return Response.json({ mensaje: `Procesados ${procesados} libros`, procesados })
}
