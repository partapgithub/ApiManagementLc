'use client'

import { signOut as nextAuthSignOut, useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NavProps {
  isAuthenticated: boolean
  supabaseSession: Session | null
}

export function Nav({ isAuthenticated, supabaseSession }: NavProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    try {
      if (supabaseSession) {
        await supabase.auth.signOut()
      } else {
        await nextAuthSignOut({ 
          callbackUrl: '/login',
          redirect: true 
        })
      }
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link href="/" className="text-xl font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300">
              Home
            </Link>
            <Link 
              href={isAuthenticated ? "/newdashboard" : "/login"} 
              className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-colors duration-300"
            >
              Dashboard
            </Link>
          </div>
          <div>
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

