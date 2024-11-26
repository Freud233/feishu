'use client'
import { getCalendar } from '@/actions'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

export default function Home() {
  const [data, setData] = useState<Object>({})
  const onSubmit = async () => {
    const res = await getCalendar()
    console.log('🚀 ~ onSubmit ~ res:', res)

    setData(res)
  }
  return (
    <div className='p-2'>
      <div className='flex gap-2 p-2'>
        <Button onClick={onSubmit} variant='bordered'>
          获取日历列表
        </Button>
      </div>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
