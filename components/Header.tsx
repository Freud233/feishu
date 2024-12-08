import { Avatar, Button } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()
  console.log('🚀 ~ Header ~ session:', session)
  return (
    <div className='flex justify-between m-auto items-center h-16 p-2 bg-purple-200'>
      <div className='font-semibold text-2xl'>LOGO</div>
      {session ? (
        <div className='flex items-center gap-3'>
          <Avatar color='primary' src={session?.user?.image || undefined} />
          <span>{session.user?.name}</span>
          <Button color='primary' onClick={() => signOut()} size='sm'>
            退出登录
          </Button>
        </div>
      ) : (
        <Button color='primary' className='text-xl' onClick={() => signIn()}>
          登录
        </Button>
      )}
    </div>
  )
}
export default Header
