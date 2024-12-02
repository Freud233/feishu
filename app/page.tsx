'use client'
import { getLarkCalendar } from '@/actions'
import { createTimeEntries, getAllProject, getTimeEntries } from '@/actions/clockify'
import MyTimer from '@/components/MyTimer'
import { LARK_LOGIN_URL } from '@/constants'
import { useClockifyStore, useLarkStore } from '@/store'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [data, setData] = useState<Array<any>>([])
  const [list, setList] = useState({})
  const { token, calendarId, updateCalendarId } = useLarkStore()
  const { workspaceId, clockifyUserId } = useClockifyStore()
  const onGetLarkCalendarHandle = async () => {
    const data = await getLarkCalendar(token)
    const cls = data?.data?.calendars
    if (cls) {
      setData(cls)
      const id = cls[0].calendar?.calendar_id || ''
      updateCalendarId(id)
    }
  }
  const onGetTimeEntriesHandle = async () => {
    const data = await getTimeEntries(clockifyUserId, workspaceId)
    console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data)
  }
  const onCreateTimeEntriesHandle = async () => {
    const data = await createTimeEntries(workspaceId)
    console.log('🚀 ~ onCreateTimeEntriesHandle ~ data:', data)
  }
  const onGetAllProjectHandle = async () => {
    const data = await getAllProject(workspaceId)
    console.log('🚀 ~ onGetAllProjectHandle ~ data:', data)
  }
  return (
    <div className='p-2'>
      <div className='flex gap-2 p-2'>
        <Button onClick={onGetLarkCalendarHandle} variant='bordered'>
          获取日历列表
        </Button>
        <Link href={`${LARK_LOGIN_URL}`}>
          <Button>飞书登录</Button>
        </Link>
        <Button onClick={onGetTimeEntriesHandle}>获取时间条目</Button>
        <Button onClick={onGetAllProjectHandle}>获取所有项目</Button>
        <Button onClick={onCreateTimeEntriesHandle}>添加时间条目</Button>
      </div>
      <div>
        <p>所有日程列表: {JSON.stringify(data)}</p>
        <p>所有日程: {JSON.stringify(list)}</p>
      </div>
      <div>TOKEN: {token}</div>
      <div>日历ID: {calendarId}</div>
      <div>工作区ID: {workspaceId}</div>
      <div>clockify用户ID: {clockifyUserId}</div>
      <div className='flex flex-col'>
        <MyTimer token={token} calendarId={calendarId} workspaceId={workspaceId} />
      </div>
    </div>
  )
}
