// @ts-nocheck
"use client"
import { useEffect, useState } from 'react'
import { MoviesAPI, Movie } from '../../lib/api'

function useToken() {
  // We cannot read httpOnly cookie from client; for demo, we call backend without token for public endpoints.
  // For protected endpoints, move to server components or add an API proxy that injects token from cookies.
  return undefined as string | undefined
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useToken()

  const [form, setForm] = useState<Omit<Movie, 'id'>>({ name: '', plot: '', genres: [], casts_id: [] })

  useEffect(() => {
    MoviesAPI.list(token)
      .then(setMovies)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [token])

  const createMovie = async () => {
    try {
      const created = await MoviesAPI.create(form, token)
      setMovies((m: any[]) => [created, ...m])
      setForm({ name: '', plot: '', genres: [], casts_id: [] })
    } catch (e: any) {
      setError(e.message)
    }
  }

  const deleteMovie = async (id: number) => {
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
      {loading ? <p>Loading…</p> : error ? <p className="text-red-600">{error}</p> : (
        <ul className="divide-y">
          {movies.map(m => (
            <li key={m.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-600">{m.plot}</p>
              </div>
              <button onClick={() => deleteMovie(m.id)} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


