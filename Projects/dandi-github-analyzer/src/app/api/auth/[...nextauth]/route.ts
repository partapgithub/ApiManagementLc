import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        const { data, error } = await supabase
          .from('users')
          .upsert({
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            auth_provider: 'google',
            last_sign_in: new Date().toISOString(),
          })
          .select()

        if (error) throw error
        return true
      } catch (error) {
        console.error('Error saving user to Supabase:', error)
        return false
      }
    }
  }
})

export { handler as GET, handler as POST }


