const base = process.env.BACKEND_BASE_URL

export async function GET(req: any, { params }: { params: { id: string } }) {
  const token = req.cookies?.get('access_token')?.value
  const r = await fetch(`${base}/api/v1/casts/${params.id}/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  const j = await r.json()
  return Response.json(j, { status: r.status })
}


