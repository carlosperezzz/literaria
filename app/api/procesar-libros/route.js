import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return Response.json({ error: 'Variables de entorno no encontradas', url: !!url, key: !!key })
  }

  const supabase = createClient(url, key)

  const { data: pendientes, error } = await supabase
    .from('libros_pendientes')
    .select('*')
    .eq('procesado', false)
    .limit(5)

  if (error) {
    return Response.json({ error: error.message, code: error.code })
  }

  return Response.json({ 
    mensaje: pendientes?.length > 0 ? `Encontrados ${pendientes.length} libros` : 'No hay libros pendientes',
    total: pendientes?.length,
    libros: pendientes?.map(l => l.titulo)
  })
}
