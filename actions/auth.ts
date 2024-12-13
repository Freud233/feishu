'use server';

import { signIn } from '@/auth';
import { client } from '@/lark-sdk';
import { ResData } from '@/type/response';

export const userLogin = async (verifyCode: string): Promise<ResData> => {
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

export const onGithubLoginHandle = async () => {
  await signIn('github');
};

export const onLarkLoginHandle = async () => {
  await signIn('lark');
};
