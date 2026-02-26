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

  const libro = pendientes[0]

  try {
    const query = encodeURIComponent(libro.titulo)
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`)
    const data = await res.json()

    if (!data.items) {
      return Response.json({ error: 'Google Books no devuelve items', respuesta: data })
    }

    const info = data.items[0].volumeInfo
    return Response.json({
      titulo: info.title,
      autor: info.authors?.[0],
      portada: info.imageLinks?.thumbnail,
      descripcion: info.description?.slice(0, 100)
    })

  } catch (e) {
    return Response.json({ error: e.message })
  }
}
