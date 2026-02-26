export async function POST(request) {
  const { mensaje } = await request.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Eres Mateo, un librero apasionado y culto. Recomiendas libros en español de forma cercana y entusiasta. Cuando alguien te diga como se siente o que busca, recomienda 1 o 2 libros concretos con una breve explicacion de por que le gustaran. Responde siempre en español y de forma concisa.'
        },
        {
          role: 'user',
          content: mensaje
        }
      ],
      max_tokens: 300
    })
  })

  const data = await response.json()
  const respuesta = data.choices[0].message.content

  return Response.json({ respuesta })
}
