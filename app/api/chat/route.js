import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const { mensaje } = await request.json()

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Eres Mateo, un librero apasionado y culto. Recomiendas libros en español de forma calida y entusiasta. Cuando alguien te diga como se siente o que busca, recomienda 2 o 3 libros concretos con una frase explicando por que cada uno. Respuestas cortas y directas.'
      },
      {
        role: 'user',
        content: mensaje
      }
    ],
    model: 'llama3-8b-8192',
    max_tokens: 300
  })

  return Response.json({ 
    respuesta: completion.choices[0].message.content 
  })
}
