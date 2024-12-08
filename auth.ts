import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async session({ session, token, user }) {
      console.log('🚀 ~ session ~ user:', user)
      console.log('🚀 ~ session ~ token:', token)
      return session
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token
      }
      console.log('🚀 ~ jwt ~ token:', token)
      return token
    },
  },
})
