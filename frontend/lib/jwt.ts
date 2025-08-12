export interface UserInfo {
  sub: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
  realm_access?: {
    roles: string[]
  }
  resource_access?: {
    [key: string]: {
      roles: string[]
    }
  }
}

export function decodeJWT(token: string): UserInfo | null {
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

export function getUserRoles(userInfo: UserInfo): string[] {
  const roles: string[] = []
  
  // Add realm roles
  if (userInfo.realm_access?.roles) {
    roles.push(...userInfo.realm_access.roles)
  }
  
  // Add resource-specific roles
  if (userInfo.resource_access) {
    Object.values(userInfo.resource_access).forEach(access => {
      if (access.roles) {
        roles.push(...access.roles)
      }
    })
  }
  
  return [...new Set(roles)] // Remove duplicates
}

export function hasRole(userInfo: UserInfo, role: string): boolean {
  const roles = getUserRoles(userInfo)
  return roles.includes(role)
}
