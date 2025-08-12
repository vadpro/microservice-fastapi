// @ts-nocheck
"use client"
import { useState, useEffect } from 'react'
import { CastsAPI, Cast, ValidationError } from '../../lib/api'
import { hasRole } from '../../lib/jwt'

function useToken() {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/auth/token')
        if (response.ok) {
          const data = await response.json()
          setToken(data.access_token)
        } else {
          console.error('Failed to get token:', response.status)
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [])

  return { token, loading }
}

interface FieldErrors {
  name?: string
  nationality?: string
}

export default function Casts() {
  const [cast, setCast] = useState<Cast | null>(null)
  const [id, setId] = useState('')
  const [form, setForm] = useState<Omit<Cast, 'id'>>({ name: '', nationality: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const { token, loading: tokenLoading } = useToken()
  const [userInfo, setUserInfo] = useState<any>(null)

  const [casts, setCasts] = useState<Cast[]>([])
  const [listLoading, setListLoading] = useState(true)

  useEffect(() => {
    if (tokenLoading) return

    if (!token) {
      setListLoading(false)
      setError('Authentication required')
      return
    }

    // Fetch user info from Keycloak
    const fetchUserInfo = async () => {
      try {
        const userResponse = await fetch('/api/auth/userinfo')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserInfo(userData)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchUserInfo()

    CastsAPI.list(token)
      .then(setCasts)
      .catch(e => setError(String(e)))
      .finally(() => setListLoading(false))
  }, [token, tokenLoading])

  const clearErrors = () => {
    setError('')
    setFieldErrors({})
  }

  const fetchCast = async () => {
    if (!token) {
      setError('Authentication required')
      return
    }
    
    clearErrors()
    try {
      const res = await CastsAPI.get(parseInt(id), token)
      setCast(res)
    } catch (e: any) {
      setCast(null)
      setError(e.message)
    }
  }

  const createCast = async () => {
    if (!token) {
      setError('Authentication required')
      return
    }
    
    clearErrors()
    try {
      const res = await CastsAPI.create(form, token)
      setCast(res)
      setForm({ name: '', nationality: '' })
      // Optimistically add to list
      setCasts((prev) => [res, ...prev])
    } catch (e: any) {
      // Parse validation errors if they exist
      if (e.message.includes('Validation failed:')) {
        const errorMessage = e.message.replace('Validation failed: ', '')
        const errors = errorMessage.split(', ')
        
        const newFieldErrors: FieldErrors = {}
        errors.forEach(error => {
          const [field, message] = error.split(': ')
          if (field === 'name' || field === 'nationality') {
            newFieldErrors[field] = message
          }
        })
        
        setFieldErrors(newFieldErrors)
      } else {
        setError(e.message)
      }
    }
  }

  const handleInputChange = (field: keyof Omit<Cast, 'id'>, value: string) => {
    setForm({ ...form, [field]: value })
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Casts</h2>
      
      {/* Role-based access control */}
      {userInfo && !hasRole(userInfo, 'user') && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ You need the 'user' role to perform actions in this section.
          </p>
        </div>
      )}
      
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <input className="flex-1 rounded-md border-gray-300" placeholder="Cast ID" value={id} onChange={e=>setId(e.target.value)} />
          <button 
            onClick={fetchCast} 
            disabled={!userInfo || !hasRole(userInfo, 'user')}
            className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Fetch
          </button>
        </div>
        {userInfo && hasRole(userInfo, 'user') && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input 
                  className={`rounded-md border-gray-300 w-full ${fieldErrors.name ? 'border-red-500' : ''}`} 
                  placeholder="Name" 
                  value={form.name} 
                  onChange={e => handleInputChange('name', e.target.value)} 
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <input 
                  className={`rounded-md border-gray-300 w-full ${fieldErrors.nationality ? 'border-red-500' : ''}`} 
                  placeholder="Nationality" 
                  value={form.nationality} 
                  onChange={e => handleInputChange('nationality', e.target.value)} 
                />
                {fieldErrors.nationality && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.nationality}</p>
                )}
              </div>
            </div>
            <button onClick={createCast} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create cast</button>
          </>
        )}
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {cast && (
        <div className="rounded-md border p-3 mb-3">
          <p className="font-medium">#{cast.id} {cast.name}</p>
          <p className="text-sm text-gray-600">{cast.nationality}</p>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-medium mb-2">All casts</h3>
        {listLoading ? (
          <p className="text-sm text-gray-500">Loading casts...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Failed to load casts</p>
        ) : casts.length === 0 ? (
          <p className="text-sm text-gray-500">No casts found.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {casts.map((c) => (
              <li key={c.id} className="p-3">
                <p className="font-medium">#{c.id} {c.name}</p>
                <p className="text-sm text-gray-600">{c.nationality}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


