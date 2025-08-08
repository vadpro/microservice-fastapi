const base = process.env.BACKEND_BASE_URL

export async function GET(req: any) {
  const token = req.cookies?.get('access_token')?.value
  const r = await fetch(`${base}/api/v1/movies`, { cache: 'no-store', headers: token ? { Authorization: `Bearer ${token}` } : {} })
  const j = await r.json()
  return Response.json(j, { status: r.status })
}

export async function POST(req: any) {
  const body = await req.text()
  const token = req.cookies?.get('access_token')?.value
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const r = await fetch(`${base}/api/v1/movies/`, { method: 'POST', body, headers })
  const j = await r.json()
  return Response.json(j, { status: r.status })
}


