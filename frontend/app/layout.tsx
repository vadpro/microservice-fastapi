// @ts-nocheck
import React from 'react'
import { cookies } from 'next/headers'
import LogoutButton from './components/LogoutButton'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access_token')
  const isAuthenticated = !!accessToken?.value

  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Microservice App</h1>
            {isAuthenticated && <LogoutButton />}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}