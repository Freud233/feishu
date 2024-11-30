import { createCalendarEvent } from '@/actions'
import { Button, Input } from '@nextui-org/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
export default function MyTimer({ calendarId, token }: any) {
  const [startTime, setStartTime] = useState<any>()
  const [title, setTitle] = useState('')
  const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({})
  console.log('🚀 ~ MyTimer ~ seconds:', seconds)
  const onPauseHandle = async () => {
    pause()
    if (!startTime || !calendarId || !token) return
    const data = await createCalendarEvent(
      {
        data: {
          summary: title,
          start_time: {
            timestamp: startTime + '',
          },
          end_time: {
            timestamp: startTime + totalSeconds + '',
          },
        },
        path: {
          calendar_id: calendarId,
        },
      },
      token
    )
    console.log('🚀 ~ onStartHandle ~ data:', data)
  }
  const onStartHandle = async () => {
    setStartTime(Math.floor(dayjs().valueOf() / 1000))
    start()
  }
  return (
    <div className='flex flex-col min-w-60 max-w-80 gap-2 p-4 bg-yellow-200 rounded-xl'>
      <Input color='secondary' value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>Timer Demo</p>
      <p>总时间: {totalSeconds}</p>
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
        <Button
          onClick={() => {
            setStartTime(Math.floor(dayjs().valueOf() / 1000))
            reset()
          }}
          color='primary'>
          Reset
        </Button>
      </div>
    </div>
  )
}
