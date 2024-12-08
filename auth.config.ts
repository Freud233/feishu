import axios from 'axios'
import { NextAuthConfig } from 'next-auth'
import { OAuthConfig } from 'next-auth/providers'
import GitHub from 'next-auth/providers/github'
const Lark = () => {
  return {
    id: 'lark',
    name: 'Lark',
    type: 'oauth',
    clientId: process.env.AUTH_LARK_ID || '',
    clientSecret: process.env.AUTH_LARK_SECRET || '',
    authorization: {
      url: `https://accounts.feishu.cn/open-apis/authen/v1/authorize`,
      params: {
        redirect_uri: process.env.AUTH_LARK_REDIRECT_URL || '',
        client_id: process.env.AUTH_LARK_ID || '',
        client_secret: process.env.AUTH_LARK_SECRET || '',
        scope: 'calendar:calendar',
        response_type: 'code',
      },
    },
    token: {
      url: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
      async request(context: any) {
        console.log('🚀 ~ request ~ context:', context)
        const { code, provider, pkce_code_verifier } = context
        const data = {
          grant_type: 'authorization_code',
          client_id: process.env.AUTH_LARK_ID || '',
          client_secret: process.env.AUTH_LARK_SECRET || '',
          code,
          code_verifier: pkce_code_verifier,
        }
        const res = await axios.post(provider.token?.url, data, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        })
        return {
          access_token: res.data.access_token,
        }
      },
    },
    userinfo: {
      url: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      async request({ tokens, provider }: any) {
        // 使用 tokens 获取用户信息
        const response = await axios.get(provider.userinfo?.url, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
        console.log('🚀 ~ request ~ response:', response)
        return response.data.data
      },
    },
    profile(profile) {
      console.log('🚀 ~ profile ~ profile:', profile)
      return {
        id: profile.user_id, // 飞书的 user_id
        name: profile.name, // 飞书的用户名
        email: profile.email, // 如果有邮箱字段
        image: profile.avatar_url, // 用户头像
      }
    },
    checks: ['pkce', 'state'],
  } as OAuthConfig<any>
}
export default {
  providers: [GitHub, Lark],
  debug: true,
  logger: {
    error(err) {
      console.log('🚀 ~ error ~ err:', err)
    },
  },
} satisfies NextAuthConfig
