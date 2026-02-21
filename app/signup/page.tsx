// app/signup/page.tsx
import React, { Suspense } from 'react'
import SignupClient from './SignupClient'

export const dynamic = 'force-dynamic' // keep page-level export here

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }>
      {/* Client component that uses client-only hooks */}
      <SignupClient />
    </Suspense>
  )
}
