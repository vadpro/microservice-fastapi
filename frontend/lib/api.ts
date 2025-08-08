export interface LoginCredentials {
  username: string
  password: string
  keycloakUrl: string
}

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
}

export async function loginWithPassword(credentials: LoginCredentials): Promise<TokenResponse> {
  const keycloakUrl = process.env.KEYCLOAK_URL || credentials.keycloakUrl
  const realm = process.env.KEYCLOAK_REALM || 'FastAPIRealm'
  const clientId = process.env.KEYCLOAK_CLIENT_ID || 'FastAPIClient'
  
  const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      username: credentials.username,
      password: credentials.password,
    }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function logout(keycloakUrl: string, refreshToken?: string): Promise<void> {
  if (refreshToken) {
    const realm = process.env.KEYCLOAK_REALM || 'FastAPIRealm'
    const clientId = process.env.KEYCLOAK_CLIENT_ID || 'FastAPIClient'
    
    await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    })
  }
}

// Movie and Cast interfaces
export interface Movie {
  id: number
  name: string
  plot: string
  genres: string[]
  casts_id: number[]
}

export interface Cast {
  id: number
  name: string
  nationality: string
}

// API classes for movies and casts
export class MoviesAPI {
  private static baseUrl: string = 'https://api-movie.dj'

  static async list(token?: string): Promise<Movie[]> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/movies/`, { headers })
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    return response.json()
  }

  static async create(movie: Omit<Movie, 'id'>, token?: string): Promise<Movie> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/movies/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(movie)
    })
    if (!response.ok) {
      throw new Error('Failed to create movie')
    }
    return response.json()
  }

  static async delete(id: number, token?: string): Promise<void> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/movies/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!response.ok) {
      throw new Error('Failed to delete movie')
    }
  }
}

export class CastsAPI {
  private static baseUrl: string = 'https://api-cast.dj'

  static async get(id: number, token?: string): Promise<Cast> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/casts/${id}/`, { headers })
    if (!response.ok) {
      throw new Error('Failed to fetch cast')
    }
    return response.json()
  }

  static async create(cast: Omit<Cast, 'id'>, token?: string): Promise<Cast> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${this.baseUrl}/api/v1/casts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cast)
    })
    if (!response.ok) {
      throw new Error('Failed to create cast')
    }
    return response.json()
  }
}