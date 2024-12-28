import { createCalendarEvent } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { createTimeEntries } from '@/actions/clockify';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { Button, Tooltip } from '@nextui-org/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { toast } from 'react-toastify';
export default function MyTimer({ color }: { color: number }) {
  const [startTime, setStartTime] = useState<number>();
  const [clockifyStartTime, setClockifyStartTime] = useState('');
  const { totalSeconds, seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({});
  const {
    token,
    tokenExpiredAt,
    refreshToken,
    updateToken,
    updateRefreshToken,
    updateIsTokenExpired,
    updateTokenExpiredAt,
    calendarId,
  } = useLarkStore();
  const { workspaceId, clockifyUserId: userId, projectId, projectData } = useClockifyStore();
  const { updateDescription } = useCalendarDescriptionStore();
  const onPauseHandle = async () => {
    pause();
    if (!startTime || !calendarId || !token) return;
    if (Date.now() > tokenExpiredAt) {
      const res = await getLarkRefreshToken(token, refreshToken);
      console.log('🚀 ~ onPauseHandle ~ res:', res);
      const { data, msg } = res;
      updateToken(data?.access_token);
      updateRefreshToken(data?.refresh_token);
      updateTokenExpiredAt(new Date().getTime() + data.expires_in * 1000);
      // updateTokenExpiredAt(new Date().getTime() + 10 * 1000);
      updateIsTokenExpired();
      toast.success(msg);
    }
    const endTime = startTime + totalSeconds + '';
    const data = await createCalendarEvent(
      {
        data: {
          summary:
            projectData &&
            projectData.filter((item) => item.id == projectId)[0].name + '-' + useCalendarStore.getState().title,
          color,
          start_time: {
            timestamp: startTime + '',
          },
          end_time: {
            timestamp: endTime,
          },
        },
        path: {
          calendar_id: calendarId,
        },
      },
      useLarkStore.getState().token,
    );
    const res = await createTimeEntries(workspaceId, {
      description: useCalendarStore.getState().title,
      start: clockifyStartTime,
      projectId: projectId || undefined,
      end: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    });
    console.log('🚀 ~ onPauseHandle ~ data:', data);
    const { code } = data;
    if (code === 0) {
      toast.success('创建日程成功', { position: 'bottom-right' });
      updateDescription(useCalendarStore.getState().title);
    } else {
      toast.warning('创建日程失败', { position: 'bottom-right' });
    }
    console.log('🚀 ~ onPauseHandle ~ res:', res);
  };
  const onStartHandle = async () => {
    if (!userId) return toast.warning('请先登录', { position: 'bottom-right' });
    setClockifyStartTime(dayjs().format('YYYY-MM-DDTHH:mm:ssZ'));
    setStartTime(Math.floor(dayjs().valueOf() / 1000));
    start();
  };
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-jade-100 p-4">
      <p>Timer Demo</p>
      <p>总时间: {totalSeconds}</p>
      <div style={{ fontSize: '100px' }}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <div className="flex gap-2">
        {isRunning ? (
          <Button onClick={onPauseHandle} color="danger">
            Pause
          </Button>
        ) : (
          <Tooltip content="请先登录" color="danger" className={userId ? 'hidden' : 'block'}>
            <Button onClick={onStartHandle} color="success">
              Start
            </Button>
          </Tooltip>
        )}
        <Button
          onClick={() => {
            if (!userId) return toast.warning('请先登录', { position: 'bottom-right' });

            setStartTime(Math.floor(dayjs().valueOf() / 1000));
            setClockifyStartTime(dayjs().format('YYYY-MM-DDTHH:mm:ssZ'));
            reset();
          }}
          color="primary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
