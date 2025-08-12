'use client'

import { useState, useEffect } from 'react'
import { decodeJWT, getUserRoles, hasRole, UserInfo } from '../../lib/jwt'

export default function CompactUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/userinfo')
        if (response.ok) {
          const userData = await response.json()
          setUserInfo(userData)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (loading || !userInfo) {
    return null
  }

  const roles = getUserRoles(userInfo)
  const hasAdminRole = hasRole(userInfo, 'admin')

  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold">
          {userInfo.given_name?.[0] || userInfo.preferred_username?.[0] || 'U'}
        </span>
      </div>
      
      <div className="flex-1">
        <p className="font-medium text-gray-900">{userInfo.name || userInfo.preferred_username}</p>
        <p className="text-sm text-gray-600">{userInfo.email}</p>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => (
          <span
            key={role}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              role === 'admin'
                ? 'bg-red-100 text-red-800'
                : role === 'user'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {role}
          </span>
        ))}
      </div>
      
      {hasAdminRole && (
        <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
          Admin Access
        </div>
      )}
    </div>
  )
}
