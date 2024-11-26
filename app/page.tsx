'use client'
import { getCalendar, getCalendarEvents } from '@/actions'
import MyTimer from '@/components/MyTimer'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

export default function Home() {
  const [data, setData] = useState<Object>({})
  const [list, setList] = useState({})
  const onSubmit = async () => {
    const res = await getCalendar()
    console.log('🚀 ~ onSubmit ~ res:', res)
    setData(res)
  }
  const getCalendarEventsHandle = async () => {
    const { data } = await getCalendarEvents()
    setList(data || {})
    console.log('🚀 ~ getCalendarHandle ~ data:', data)
  }
  return (
    <div className='p-2'>
      <div className='flex gap-2 p-2'>
        <Button onClick={onSubmit} variant='bordered'>
          获取日历列表
        </Button>
        <Button onClick={getCalendarEventsHandle}>获取日程列表</Button>
      </div>
      <p>所有日程列表: {JSON.stringify(data)}</p>
      <p>所有日程: {JSON.stringify(list)}</p>
      <div className='flex'>
        <MyTimer />
      </div>
    </div>
  )
}
