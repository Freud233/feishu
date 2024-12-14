'use server';
import { signIn } from '@/auth';
import { client } from '@/lark-sdk';
import { IResData } from '@/type/response';

export const getLarkAccessToken = async (verifyCode: string): Promise<IResData> => {
  if (!verifyCode) {
    return {
      code: 10004,
      msg: 'token令牌错误',
    };
  }
  const { data, msg, code } = await client.authen.accessToken.create({
    data: {
      code: verifyCode,
      grant_type: 'authorization_code',
    },
  });
  return code === 0
    ? {
        code: 0,
        msg: '登录成功',
        data,
      }
    : {
        code: 10003,
        msg: '登录错误',
      };
};

export const getLarkRefreshToken = async (accessToken: string, refresh_token: string): Promise<IResData> => {
  try {
    if (!accessToken || !refresh_token)
      return {
        code: 10005,
        msg: '请输入token',
      };
    const { code, data, msg } = await client.authen.refreshAccessToken.create({
      data: {
        grant_type: 'refresh_token',
        refresh_token,
      },
    });
    return {
      code,
      msg,
      data,
    };
  } catch (error) {
    throw error;
  }
};
export const onGithubLoginHandle = async () => {
  await signIn('github');
};

export const onLarkLoginHandle = async () => {
  await signIn('lark');
};
