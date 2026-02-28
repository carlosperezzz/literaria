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
  const resultados = []

  for (const libro of pendientes) {
    try {
      const query = encodeURIComponent(libro.titulo)
      const res = await fetch(`https://itunes.apple.com/search?term=${query}&media=ebook&country=es&lang=es_es&limit=5`)
      const data = await res.json()

      if (data.results && data.results.length > 0) {
        const item = data.results[0]
        const portada = item.artworkUrl100?.replace('100x100', '600x600') || ''
        const autor = item.artistName || 'Desconocido'
        const descripcion = item.description?.slice(0, 500) || ''
        const genero = item.primaryGenreName || 'Ficcion'
        const titulo = item.trackName || libro.titulo

        await supabase.from('libros').insert({
          titulo,
          autor,
          genero,
          descripcion,
          portada_url: portada,
          estado_animo: 'reflexivo'
        })

        await supabase.from('libros_pendientes').update({ procesado: true }).eq('id', libro.id)
        procesados++
        resultados.push({ titulo, autor, portada: !!portada })
      }
    } catch (e) {
      console.error('Error:', libro.titulo, e)
    }
  }

  return Response.json({ mensaje: `Procesados ${procesados} libros`, procesados, resultados })
}
