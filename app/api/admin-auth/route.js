export const dynamic = 'force-dynamic'

export async function POST(request) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (password === adminPassword) {
    return Response.json({ ok: true })
  } else {
    return Response.json({ ok: false })
  }
}
