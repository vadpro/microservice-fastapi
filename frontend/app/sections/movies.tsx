// @ts-nocheck
"use client"
import { useEffect, useState } from 'react'
import { MoviesAPI, Movie, CastsAPI, Cast } from '../../lib/api'

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

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token, loading: tokenLoading } = useToken()

  const [form, setForm] = useState<Omit<Movie, 'id'>>({ name: '', plot: '', genres: [], casts_id: [] })
  const [castCache, setCastCache] = useState<Record<number, Cast>>({})

  useEffect(() => {
    if (tokenLoading) return // Wait for token to load
    
    if (!token) {
      setError('Authentication required')
      setLoading(false)
      return
    }
    
    MoviesAPI.list(token)
      .then(setMovies)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token, tokenLoading])

  useEffect(() => {
    if (!movies.length) return
    const uniqueIds = new Set<number>()
    movies.forEach(m => m.casts_id.forEach((id: number) => uniqueIds.add(id)))
    const idsToFetch = Array.from(uniqueIds).filter((id) => !castCache[id])
    if (!idsToFetch.length) return

    Promise.all(
      idsToFetch.map((id) =>
        CastsAPI.get(id, token)
          .then((cast) => [id, cast] as const)
          .catch(() => null)
      )
    ).then((results) => {
      const nextCache: Record<number, Cast> = { ...castCache }
      results.forEach((pair) => {
        if (pair) {
          const [id, cast] = pair
          nextCache[id] = cast
        }
      })
      setCastCache(nextCache)
    })
  }, [movies, token, castCache])

  const createMovie = async () => {
    if (!token) {
      setError('Authentication required')
      return
    }
    
    try {
      const created = await MoviesAPI.create(form, token)
      setMovies((m: any[]) => [created, ...m])
      setForm({ name: '', plot: '', genres: [], casts_id: [] })
    } catch (e: any) {
      setError(e.message)
    }
  }

  const deleteMovie = async (id: number) => {
    if (!token) {
      setError('Authentication required')
      return
    }
    
    try {
      await MoviesAPI.delete(id, token)
      setMovies((m: any[]) => m.filter((x: any) => x.id !== id))
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Movies</h2>
      <div className="space-y-2 mb-4">
        <input className="w-full rounded-md border-gray-300" placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-md border-gray-300" placeholder="Plot" value={form.plot} onChange={e=>setForm({ ...form, plot: e.target.value })} />
        <input className="w-full rounded-md border-gray-300" placeholder="Genres (comma)" value={form.genres.join(',')} onChange={e=>setForm({ ...form, genres: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) })} />
        <input className="w-full rounded-md border-gray-300" placeholder="Cast IDs (comma)" value={form.casts_id.join(',')} onChange={e=>setForm({ ...form, casts_id: e.target.value.split(',').map(s=>parseInt(s)).filter(n=>!Number.isNaN(n)) })} />
        <button onClick={createMovie} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Create movie</button>
      </div>
      {loading || tokenLoading ? <p>Loading…</p> : error ? <p className="text-red-600">{error}</p> : (
        <ul className="divide-y">
          {movies.map(m => (
            <li key={m.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-600">{m.plot}</p>
                <p className="text-sm text-gray-600">Genres: {m.genres && m.genres.length ? m.genres.join(', ') : '—'}</p>
                <p className="text-sm text-gray-600">
                  Cast: {m.casts_id && m.casts_id.length ? m.casts_id.map((id: number) => {
                    const c = castCache[id]
                    if (!c) return `#${id}`
                    return `${c.name}${c.nationality ? ` (${c.nationality})` : ''}`
                  }).join(', ') : '—'}
                </p>
              </div>
              <button onClick={() => deleteMovie(m.id)} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


