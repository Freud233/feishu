'use server';

import { signIn } from '@/auth';
import { client } from '@/lark-sdk';
import { ResData } from '@/type/response';

export const userLogin = async (verifyCode: string): Promise<ResData> => {
  const { data, msg, code } = await client.authen.accessToken.create({
    data: {
      code: verifyCode,
      grant_type: 'authorization_code',
    },
  });
  return code === 0 ? { data, msg, code } : { code: 10001, msg: '登录错误' };
};

export const onGithubLoginHandle = async () => {
  await signIn('github');
};

export const onLarkLoginHandle = async () => {
  await signIn('lark');
};
