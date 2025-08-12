export async function GET(req: any) {
  try {
    const accessToken = req.cookies?.get('access_token')?.value
    
    if (!accessToken) {
      return Response.json({ error: 'No access token found' }, { status: 401 })
    }
    
    // Get Keycloak configuration from environment
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://host.docker.internal:7070'
    const realm = process.env.KEYCLOAK_REALM || 'FastAPIRealm'
    
    // Decode JWT token to get user info and roles (since userinfo endpoint might not be accessible)
    const tokenData = extractTokenData(accessToken)
    
    if (!tokenData) {
      return Response.json({ error: 'Invalid access token' }, { status: 401 })
    }
    
    // Extract user info from token
    const userInfo = {
      sub: tokenData.sub,
      email_verified: tokenData.email_verified || false,
      name: tokenData.name || tokenData.preferred_username || '',
      preferred_username: tokenData.preferred_username || '',
      given_name: tokenData.given_name || '',
      family_name: tokenData.family_name || '',
      email: tokenData.email || ''
    }
    
    // Extract roles from the same token data
    const roles = extractRolesFromToken(accessToken)
    
    // Combine user info with roles
    const enrichedUserInfo = {
      ...userInfo,
      roles: roles.filter((role, index) => roles.indexOf(role) === index), // Remove duplicates
      realm_access: { roles },
      resource_access: {} // Will be populated if needed
    }
    
    return Response.json(enrichedUserInfo)
  } catch (error) {
    console.error('Error fetching user info:', error)
    return Response.json({ error: 'Failed to get user information' }, { status: 500 })
  }
}

function extractTokenData(token: string): any {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = parts[1]
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Failed to decode JWT token:', error)
    return null
  }
}

function extractRolesFromToken(token: string): string[] {
  try {
    const tokenData = extractTokenData(token)
    if (!tokenData) {
      return []
    }
    
    const roles: string[] = []
    
    // Extract realm roles
    if (tokenData.realm_access?.roles) {
      roles.push(...tokenData.realm_access.roles)
    }
    
    // Extract resource-specific roles
    if (tokenData.resource_access) {
      Object.keys(tokenData.resource_access).forEach((key) => {
        const access = tokenData.resource_access[key]
        if (access.roles) {
          roles.push(...access.roles)
        }
      })
    }
    
    return roles
  } catch (error) {
    console.error('Failed to decode JWT token:', error)
    return []
  }
}
