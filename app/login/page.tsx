// app/login/page.tsx
export const dynamic = 'force-dynamic'

import React from 'react'
import LoginClient from './LoginClient'

/**
 * We intentionally accept "props: any" to avoid Next internal PageProps typing mismatches
 * across Next versions (some versions use Promise<any> for searchParams).
 */
export default function LoginPage(props: any) {
  const { searchParams } = props

  let redirect = '/'

  // Case: searchParams is a Promise (some Next versions)
  if (searchParams && typeof searchParams.then === 'function') {
    // Can't await here reliably; default to '/'
    redirect = '/'
  } else if (searchParams instanceof URLSearchParams) {
    redirect = searchParams.get('redirect') || '/'
  } else if (typeof searchParams === 'object' && searchParams !== null) {
    const r = (searchParams as Record<string, unknown>)?.redirect
    redirect = typeof r === 'string' ? r : '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginClient redirectTo={redirect} />
      </div>
    </div>
  )
}
