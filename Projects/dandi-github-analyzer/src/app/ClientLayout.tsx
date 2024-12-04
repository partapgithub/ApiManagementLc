'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { Nav } from './components/nav'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null)
  const { data: nextAuthSession } = useSession()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAuthenticated = !!(nextAuthSession || supabaseSession)

  return (
    <div className="min-h-screen flex flex-col">
      <Nav isAuthenticated={isAuthenticated} supabaseSession={supabaseSession} />
      <main className="flex-1 mt-16 p-4">
        {children}
      </main>
    </div>
  )
} 