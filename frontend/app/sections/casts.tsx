// @ts-nocheck
"use client"
import { useState } from 'react'
import { CastsAPI, Cast, ValidationError } from '../../lib/api'

function useToken() {
  return undefined as string | undefined
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
  const token = useToken()

  const clearErrors = () => {
    setError('')
    setFieldErrors({})
  }

  const fetchCast = async () => {
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
    clearErrors()
    try {
      const res = await CastsAPI.create(form, token)
      setCast(res)
      setForm({ name: '', nationality: '' })
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
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <input className="flex-1 rounded-md border-gray-300" placeholder="Cast ID" value={id} onChange={e=>setId(e.target.value)} />
          <button onClick={fetchCast} className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">Fetch</button>
        </div>
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
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {cast && (
        <div className="rounded-md border p-3">
          <p className="font-medium">#{cast.id} {cast.name}</p>
          <p className="text-sm text-gray-600">{cast.nationality}</p>
        </div>
      )}
    </div>
  )
}


