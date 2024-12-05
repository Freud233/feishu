import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    {
      id: 'lark',
      name: 'Lark',
      type: 'oauth',
      clientId: process.env.AUTH_LARK_ID || '',
      // redirectProxyUrl:'',
      clientSecret: process.env.AUTH_LARK_SECRET || '',
      authorization: {
        url: `https://accounts.feishu.cn/open-apis/authen/v1/authorize`,
        params: {
          client_id: process.env.AUTH_LARK_ID || '',
          redirect_uri: process.env.AUTH_LARK_REDIRECT_URL || '',
          scope: 'calendar:calendar',
        },
      },
      token: {
        url: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
        async request(context: any) {},
      },
      userinfo: { url: 'https://open.feishu.cn/open-apis/authen/v1/user_info', async request({}) {} },
      profile(profile) {
        return {
          id: profile.id,
        }
      },
    },
  ],
})
