export async function GET(req: any) {
  try {
    const accessToken = req.cookies?.get('access_token')?.value
    
    if (!accessToken) {
      return Response.json({ error: 'No access token found' }, { status: 401 })
    }
    
    return Response.json({ access_token: accessToken })
  } catch (error) {
    return Response.json({ error: 'Failed to get token' }, { status: 500 })
  }
} 