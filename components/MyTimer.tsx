import { createCalendarEvent } from '@/actions'
import { Button } from '@nextui-org/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
export default function MyTimer({ expiryTimestamp }: any) {
  const [startTime, setStartTime] = useState<any>()
  const [endTime, setEndTime] = useState<any>()
  const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({})
  const onPauseHandle = async () => {
    setEndTime(Math.floor(dayjs().valueOf() / 1000))
    console.log(dayjs().valueOf() / 1000)
    console.log(endTime, 'endtime')

    const data = await createCalendarEvent({
      data: {
        summary: '赛风赛风赛风',
        start_time: {
          timestamp: startTime + '',
        },
        end_time: {
          timestamp: endTime + '',
        },
      },
      path: {
        calendar_id: 'feishu.cn_LmrMbhw6ax6msjdXFf3MDh@group.calendar.feishu.cn',
      },
    })
    console.log('🚀 ~ onStartHandle ~ data:', data)
    pause()
  }
  const onStartHandle = async () => {
    setStartTime(Math.floor(dayjs().valueOf() / 1000))
    start()
  }
  return (
    <div className='flex flex-col'>
      <h1>react-timer-hook </h1>
      <p>Timer Demo</p>
      <div style={{ fontSize: '100px' }}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <div className='flex gap-2'>
        {isRunning ? (
          <Button onClick={onPauseHandle} color='danger'>
            Pause
          </Button>
        ) : (
          <Button onClick={onStartHandle} color='success'>
            Start
          </Button>
        )}
        <Button onClick={() => reset()} color='primary'>
          Reset
        </Button>
      </div>
    </div>
  )
}
