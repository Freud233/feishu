'use client'
import { getCalendar, getCalendarEvents } from '@/actions'
import { userLogin } from '@/actions/auth'
import { createTimeEntries, getAllWorkSpaces, getTimeEntries, getUserInfo } from '@/actions/clockify'
import MyTimer from '@/components/MyTimer'
import { useClockifyStore, useLarkStore } from '@/store'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<Array<any>>([])
  const [list, setList] = useState({})
  const code = useSearchParams().get('code') || ''
  const token = useLarkStore((state: any) => state.token)
  const updateToken = useLarkStore((state: any) => state.updateToken)
  const calendarId = useLarkStore((state: any) => state.calendarId)
  const updateCalendarId = useLarkStore((state: any) => state.updateCalendarId)
  const workspaceId = useClockifyStore((state: any) => state.workspaceId)
  const updateWorkspaceId = useClockifyStore((state: any) => state.updateWorkspaceId)
  const clockifyUserId = useClockifyStore((state: any) => state.clockifyUserId)
  const updateClockifyUserId = useClockifyStore((state: any) => state.updateClockifyUserId)
  const onSubmit = async () => {
    const data = await getCalendar(token)
    const cls = data?.data?.calendars
    if (cls) {
      setData(cls)
      const id = cls[0].calendar?.calendar_id || ''
      updateCalendarId(id)
    }
  }
  const getCalendarEventsHandle = async (calendarId: string) => {
    const res = await getCalendarEvents(calendarId, token)
    if (res.data?.items) {
      setList(res.data.items || {})
    }
  }
  const onLoginHandle = async () => {
    console.log('🚀 ~ onLoginHandle ~ data:', data)
  }
  const login = async () => {
    const res = await userLogin(code)
    if (res?.access_token) {
      updateToken(res.access_token)
    }
  }
  const onGetAllWorkSpacesHandle = async () => {
    const res = await getAllWorkSpaces()
    if (res[0].id) {
      console.log('🚀 ~ Home ~ workSpaceId:', workspaceId)
      updateWorkspaceId(res[0].id)
    }
    console.log('🚀 ~ onGetAllWorkSpacesHandle ~ res:', res)
  }
  const onGetUserInfoHandle = async () => {
    const data = await getUserInfo()
    const { id, activeWorkspace } = data
    updateWorkspaceId(activeWorkspace)
    updateClockifyUserId(id)
  }
  const onGetTimeEntriesHandle = async () => {
    const data = await getTimeEntries(clockifyUserId, workspaceId)
    console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data)
  }
  const onCreateTimeEntriesHandle = async () => {
    const data = await createTimeEntries(workspaceId)
    console.log('🚀 ~ onCreateTimeEntriesHandle ~ data:', data)
  }
  useEffect(() => {
    login()
  }, [])
  useEffect(() => {
    onSubmit()
  }, [token])
  return (
    <div className='p-2'>
      <div className='flex gap-2 p-2'>
        <Button onClick={onSubmit} variant='bordered'>
          获取日历列表
        </Button>
        <Button onClick={() => getCalendarEventsHandle(calendarId)}>获取日程列表</Button>
        <Button onClick={onLoginHandle}>登录</Button>
        <Link
          href={`https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a682708d8038100e&redirect_uri=http://localhost:3000&scope=calendar:calendar`}>
          <Button>飞书登录</Button>
        </Link>
        <Button onClick={onGetAllWorkSpacesHandle}>获取所有工作区</Button>
        <Button onClick={onGetUserInfoHandle}>获取用户信息</Button>
        <Button onClick={onGetTimeEntriesHandle}>获取时间条目</Button>
        <Button onClick={onCreateTimeEntriesHandle}>添加时间条目</Button>
      </div>
      <p>所有日程列表: {JSON.stringify(data)}</p>
      <p>所有日程: {JSON.stringify(list)}</p>
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
