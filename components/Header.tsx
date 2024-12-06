import { Avatar } from '@nextui-org/react'

const Header = () => {
  return (
    <div className='flex justify-between m-auto items-center h-16 p-2 bg-purple-200'>
      <div className='font-semibold text-2xl'>LOGO</div>
      <div className='flex items-center gap-3'>
        <Avatar color='primary' />
        <span>Eminem</span>
      </div>
    </div>
  )
}
export default Header
