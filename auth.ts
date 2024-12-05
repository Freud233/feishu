import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ authorized ~ nextUrl:', nextUrl)
      console.log('🚀 ~ authorized ~ auth:', auth)
      return true
    },
    async jwt({ token, user, session }) {
      console.log('🚀 ~ jwt ~ session:', session)
      console.log('🚀 ~ jwt ~ user:', user)
      console.log('🚀 ~ jwt ~ token:', token)
      return token
    },
  },
})
