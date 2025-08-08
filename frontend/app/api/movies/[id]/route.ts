const base = process.env.BACKEND_BASE_URL

export async function GET(req: any, { params }: { params: { id: string } }) {
  const token = req.cookies?.get('access_token')?.value
  const r = await fetch(`${base}/api/v1/movies/${params.id}/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  const j = await r.json()
  return Response.json(j, { status: r.status })
}

export async function PUT(req: any, { params }: { params: { id: string } }) {
  const body = await req.text()
  const token = req.cookies?.get('access_token')?.value
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const r = await fetch(`${base}/api/v1/movies/${params.id}/`, { method: 'PUT', body, headers })
  const j = await r.json()
  return Response.json(j, { status: r.status })
}

export async function DELETE(req: any, { params }: { params: { id: string } }) {
  const token = req.cookies?.get('access_token')?.value
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const r = await fetch(`${base}/api/v1/movies/${params.id}/`, { method: 'DELETE', headers })
  if (r.headers.get('content-type')?.includes('application/json')) {
    const j = await r.json()
    return Response.json(j, { status: r.status })
  }
  return Response.json({}, { status: r.status })
}


