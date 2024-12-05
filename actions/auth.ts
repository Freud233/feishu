'use server'

import { signIn } from '@/auth'
import { client } from '@/lark-sdk'

export const userLogin = async (code: string) => {
  const { data } = await client.authen.accessToken.create({
    data: {
      code,
      grant_type: 'authorization_code',
    },
  })

  return data
}

export const onGithubLoginHandle = async () => {
  await signIn('github')
}
