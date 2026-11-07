import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    // 不再打印 jwt / session 内容：这些回调日志会把 access_token 写进服务端日志
    async session({ session }) {
      return session;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      return token;
    },
  },
});
