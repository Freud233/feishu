'use client'
import { getCalendar, getCalendarEvents } from '@/actions'
import { userLogin } from '@/actions/auth'
import { createTimeEntries, getAllWorkSpaces, getTimeEntries, getUserInfo } from '@/actions/clockify'
import MyTimer from '@/components/MyTimer'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<Array<any>>([])
  const [list, setList] = useState({})
  const [accessToken, setAccessToken] = useState('')
  const [cId, setCId] = useState('')
  const code = useSearchParams().get('code') || ''
  const [workspaceId, setWorkspaceId] = useState('')
  const [userId, setUserId] = useState('')
  const onSubmit = async () => {
    const data = await getCalendar(accessToken)
    console.log('🚀 ~ onSubmit ~ data:', data)
    const cls = data?.data?.calendars
    if (cls) {
      setData(cls)
      const id = cls[0].calendar?.calendar_id || ''
      setCId(id)
    }
  }
  const getCalendarEventsHandle = async (calendarId: string) => {
    const res = await getCalendarEvents(calendarId, accessToken)
    console.log('🚀 ~ getCalendarEventsHandle ~ res:', res)
    console.log('🚀 ~ getCalendarEventsHandle ~ calendarId:', calendarId)
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
      setAccessToken(res.access_token)
    }
  }
  const onGetAllWorkSpacesHandle = async () => {
    const res = await getAllWorkSpaces()
    if (res[0].id) {
      setWorkspaceId(res[0].id)
      console.log('🚀 ~ Home ~ workSpaceId:', workspaceId)
    }
    console.log('🚀 ~ onGetAllWorkSpacesHandle ~ res:', res)
  }
  const onGetUserInfoHandle = async () => {
    const data = await getUserInfo()
    const { id, activeWorkspace } = data
    setUserId(id)
    setWorkspaceId(activeWorkspace)
  }
  const onGetTimeEntriesHandle = async () => {
    const data = await getTimeEntries(userId, workspaceId)
    console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data)
  }
  const onCreateTimeEntriesHandle = async () => {
    const data = await createTimeEntries(workspaceId)
    console.log('🚀 ~ onCreateTimeEntriesHandle ~ data:', data)
  }
  useEffect(() => {
    login()
  }, [])
  return (
    <div className='p-2'>
      <div className='flex gap-2 p-2'>
        <Button onClick={onSubmit} variant='bordered'>
          获取日历列表
        </Button>
        <Button onClick={() => getCalendarEventsHandle(cId)}>获取日程列表</Button>
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
      <div className='flex flex-col'>
        <MyTimer token={accessToken} calendarId={cId} workspaceId={workspaceId} />
      </div>
    </div>
  )
}
