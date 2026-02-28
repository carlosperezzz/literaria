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
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 300,
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en literatura. Responde SIEMPRE en formato JSON válido sin texto adicional.'
            },
            {
              role: 'user',
              content: `Dame información del libro "${libro.titulo}" en este formato JSON exacto:
{
  "titulo": "título exacto del libro",
  "autor": "nombre completo del autor",
  "genero": "género literario",
  "descripcion": "sinopsis de 2-3 frases",
  "estado_animo": "una de estas opciones: feliz, reflexivo, misterio, aventura"
}`
            }
          ]
        })
      })

      const groqData = await groqRes.json()
      const texto = groqData.choices[0].message.content
      const info = JSON.parse(texto.replace(/```json|```/g, '').trim())

      // Buscar portada en Open Library por título y autor
      let portada = ''
      try {
        const query = encodeURIComponent(`${info.titulo} ${info.autor}`)
        const olRes = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=5`)
        const olData = await olRes.json()

        if (olData.docs) {
          for (const doc of olData.docs) {
            if (doc.cover_i) {
              portada = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
              break
            }
          }
        }
      } catch (e) {}

      await supabase.from('libros').insert({
        titulo: info.titulo || libro.titulo,
        autor: info.autor || 'Desconocido',
        genero: info.genero || 'Ficcion',
        descripcion: info.descripcion || '',
        portada_url: portada,
        estado_animo: info.estado_animo || 'reflexivo'
      })

      await supabase
        .from('libros_pendientes')
        .update({ procesado: true })
        .eq('id', libro.id)

      procesados++

    } catch (e) {
      console.error('Error procesando:', libro.titulo, e)
    }
  }

  return Response.json({ mensaje: `Procesados ${procesados} libros`, procesados })
}
