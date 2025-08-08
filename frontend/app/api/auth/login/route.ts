import { loginWithPassword } from '../../../../lib/api'

export async function POST(req: any) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return Response.json({ error: 'Missing credentials' }, { status: 400 })
  }
  try {
        // Use environment variables for Keycloak configuration
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://host.docker.internal:7070'
    console.log('Keycloak URL:', keycloakUrl)
    console.log('Keycloak Realm:', process.env.KEYCLOAK_REALM)
    console.log('Keycloak Client ID:', process.env.KEYCLOAK_CLIENT_ID)
    const token = await loginWithPassword({ username, password, keycloakUrl })
    
    // Create response with cookies
    const response = Response.json({ ok: true })
    
    // Set cookies using headers
    const cookieHeaders = [
      `access_token=${token.access_token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${token.expires_in - 5}`,
    ]
    
    if (token.refresh_token) {
      cookieHeaders.push(`refresh_token=${token.refresh_token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`)
    }
    
    response.headers.set('Set-Cookie', cookieHeaders.join(', '))
    
    return response
  } catch (e: any) {
    console.error('Login error:', e)
    return Response.json({ error: e.message ?? 'Login failed' }, { status: 401 })
  }
}