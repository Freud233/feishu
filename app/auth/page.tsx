'use client'

import { userLogin } from '@/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const AuthPage = () => {
  const router = useRouter()
  const code = useSearchParams().get('code') || ''
  const onLoginHandle = async () => {
    const data = await userLogin(code)
    console.log('🚀 ~ onLoginHandle ~ data:', data)
  }
  useEffect(() => {
    onLoginHandle()
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [])
  const searchParams = useSearchParams()
  console.log('🚀 ~ AuthPage ~ searchParams:', searchParams.get('code'))
  return <div>Auth Page</div>
}
export default AuthPage
