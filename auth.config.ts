import { NextAuthConfig } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';

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
        scope: 'calendar:calendar',
        response_type: 'code',
      },
    },
    token: {
      url: 'https://open.feishu.cn/open-apis/authen/v2/oauth/token',
      async request(context: any) {
        const { code, provider, pkce_code_verifier } = context;
        // 用原生 fetch 代替 axios：auth.config 会被 middleware 引入，
        // axios 依赖 setImmediate / process.nextTick，在 Edge Runtime 不可用且会撑大 middleware 体积
        const response = await fetch(provider.token?.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH_LARK_ID || '',
            client_secret: process.env.AUTH_LARK_SECRET || '',
            code,
            code_verifier: pkce_code_verifier,
          }),
        });
        if (!response.ok) throw new Error(`Lark token request failed: ${response.status}`);
        const result = await response.json();
        return { access_token: result.access_token };
      },
    },
    userinfo: {
      url: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      async request({ tokens, provider }: any) {
        const response = await fetch(provider.userinfo?.url, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        if (!response.ok) throw new Error(`Lark userinfo request failed: ${response.status}`);
        const result = await response.json();
        return result.data;
      },
    },
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    checks: ['pkce', 'state'],
  } as OAuthConfig<any>;
};

export default {
  providers: [GitHub, Lark],
  // debug 会把完整的 OAuth 上下文写进日志，仅本地开发开启
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(error) {
      console.error('[auth]', error);
    },
  },
} satisfies NextAuthConfig;
