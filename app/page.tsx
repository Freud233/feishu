'use client'
import { getLarkCalendar } from '@/actions'
import { onGithubLoginHandle, onLarkLoginHandle } from '@/actions/auth'
import { getAllProject, getTimeEntries } from '@/actions/clockify'
import Header from '@/components/Header'
import MyTimer from '@/components/MyTimer'
import { LARK_LOGIN_URL } from '@/constants'
import { useClockifyStore, useLarkStore } from '@/store'
import { IClockifyProject } from '@/type'
import { Button, Select, SelectItem } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const { data } = useSession()
  console.log('🚀 ~ Home ~ data:', data)
  const { token, calendarId, updateCalendarId } = useLarkStore()
  const { workspaceId, clockifyUserId, projectData, updateProjectData } = useClockifyStore()
  const [projectId, setProjectId] = useState<string>('')
  const [color, setColor] = useState(0)
  const onGetLarkCalendarHandle = async () => {
    const data = await getLarkCalendar(token)
    const cls = data?.data?.calendars
    if (cls) {
      // setData(cls)
      const id = cls[0].calendar?.calendar_id || ''
      updateCalendarId(id)
    }
  }
  const onGetTimeEntriesHandle = async () => {
    const data = await getTimeEntries(clockifyUserId, workspaceId)
    console.log('🚀 ~ onGetTimeEntriesHandle ~ data:', data)
  }
  // const onCreateTimeEntriesHandle = async () => {
  //   const data = await createTimeEntries(workspaceId)
  //   console.log('🚀 ~ onCreateTimeEntriesHandle ~ data:', data)
  // }
  const onGetAllProjectHandle = async () => {
    const data = await getAllProject(workspaceId)
    console.log('🚀 ~ onGetAllProjectHandle ~ data:', data)
    updateProjectData(data)
  }

  function hexToRgbInt32(hex: string) {
    // 去掉前导的 '#'
    hex = hex.slice(1)

    // 解析 RGB 分量
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    // 组合成一个 32 位的整数（在 JavaScript 中是 Number 类型）
    // 注意：这里我们实际上只使用了低 24 位，因为 RGB 只有 24 位
    const rgbInt32 = (r << 16) | (g << 8) | b

    return rgbInt32
  }
  const ProjectRender = ({ data }: { data: IClockifyProject[] }) => {
    return (
      <>
        <Select
          label='项目'
          color='success'
          selectedKeys={[projectId]}
          className='max-w-xl'
          onSelectionChange={(e) => {
            console.log(e.currentKey)
            const colorArr = data.filter((i) => {
              if (i.id == e.currentKey) {
                return i.color
              }
            })
            setColor(hexToRgbInt32(colorArr[0]?.color) || 0)
            setProjectId(e.currentKey || '')
          }}>
          {data.map((item) => (
            <SelectItem key={item.id}>{item.name}</SelectItem>
          ))}
        </Select>
      </>
    )
  }
  return (
    <div className='h-screen'>
      <Header></Header>
      <div className='grid grid-rows-3 grid-flow-col gap-4 p-4'>
        <div className='flex gap-2 p-2 rounded-xl col-span-2 bg-sky-50 leading-10'>
          <Button onClick={onGetLarkCalendarHandle} variant='ghost' color='primary'>
            获取日历列表
          </Button>
          <Link href={`${process.env.NEXT_PUBLIC_REDIRECT_URL || LARK_LOGIN_URL}`}>
            <Button variant='ghost' color='secondary'>
              飞书登录
            </Button>
          </Link>
          <Button color='success' onClick={onGetTimeEntriesHandle} variant='ghost'>
            获取时间条目
          </Button>
          <Button variant='ghost' color='secondary' onClick={onGetAllProjectHandle}>
            获取所有项目
          </Button>
          {/* <Button onClick={onCreateTimeEntriesHandle}>添加时间条目</Button> */}
          <Button variant='ghost' color='success' onClick={onGithubLoginHandle}>
            github登录
          </Button>
          <Button variant='ghost' color='secondary' onClick={onLarkLoginHandle}>
            OAuth 飞书登录
          </Button>
        </div>
        <div className='flex gap-3 flex-col row-span-2 col-span-2 rounded-xl bg-pink-50 p-2'>
          <div>TOKEN: {token}</div>
          <div>日历ID: {calendarId}</div>
          <div>工作区ID: {workspaceId}</div>
          <div>clockify用户ID: {clockifyUserId}</div>
        </div>
        <div className='gap-2 rounded-xl row-span-3 col-span-1 flex'>
          <MyTimer token={token} calendarId={calendarId} workspaceId={workspaceId} projectId={projectId} color={color} />
          {projectData && projectData.length > 0 && <ProjectRender data={projectData} />}
        </div>
      </div>
    </div>
  )
}
