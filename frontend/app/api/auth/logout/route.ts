import { logout } from '../../../../lib/api'

export async function POST(req: any) {
  try {
    const refreshToken = req.cookies?.get('refresh_token')?.value
    
    if (refreshToken) {
      const keycloakUrl = process.env.KEYCLOAK_URL || 'http://host.docker.internal:7070'
      console.log('Logout - Keycloak URL:', keycloakUrl)
      console.log('Logout - Keycloak Realm:', process.env.KEYCLOAK_REALM)
      console.log('Logout - Keycloak Client ID:', process.env.KEYCLOAK_CLIENT_ID)
      await logout(keycloakUrl, refreshToken)
    }
    
    const response = Response.json({ ok: true })
    
    // Clear authentication cookies
    const cookieHeaders = [
      'access_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
      'refresh_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
    ]
    
    response.headers.set('Set-Cookie', cookieHeaders.join(', '))
    
    return response
  } catch (e: any) {
    return Response.json({ error: e.message ?? 'Logout failed' }, { status: 500 })
  }
}