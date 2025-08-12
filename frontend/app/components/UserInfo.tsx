'use client'

import { useState, useEffect } from 'react'
import { getUserRoles, hasRole, UserInfo as UserInfoType } from '../../lib/jwt'

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/userinfo')
        if (response.ok) {
          const userData = await response.json()
          setUserInfo(userData)
        } else {
          setError('Failed to get user information from Keycloak')
        }
      } catch (error) {
        setError('Error fetching user information')
        console.error('Error fetching user info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !userInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700 text-sm">
          {error || 'Unable to load user information'}
        </p>
      </div>
    )
  }

  const roles = getUserRoles(userInfo)
  const hasAdminRole = hasRole(userInfo, 'admin')
  const hasUserRole = hasRole(userInfo, 'user')

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Current User Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-900">{userInfo.name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Username</p>
              <p className="font-medium text-gray-900">{userInfo.preferred_username || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{userInfo.email || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Email Verified</p>
              <p className="font-medium text-gray-900">
                {userInfo.email_verified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-red-600">✗ Not verified</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-600 mb-2">Access Permissions</p>
            <div className="flex flex-wrap gap-2">
              {roles.length > 0 ? (
                roles.map((role) => (
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
                ))
              ) : (
                <span className="text-gray-500 text-sm">No roles assigned</span>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-gray-600 mb-2 font-medium">Available Actions</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasUserRole ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>View casts and movies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasUserRole ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Create new casts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasAdminRole ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Admin operations (if admin role)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {userInfo.given_name?.[0] || userInfo.preferred_username?.[0] || 'U'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
