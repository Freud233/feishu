import { createCalendarEvent } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { createTimeEntries } from '@/actions/clockify';
import { CODE } from '@/constants';
import { hasTokenExpired } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { Button, Tooltip } from '@heroui/react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
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

    // 刷新成功后直接使用返回的新 token，不依赖 store 的异步更新时序
    let accessToken = token;
    if (hasTokenExpired(tokenExpiredAt)) {
      const res = await getLarkRefreshToken(token, refreshToken);
      if (res.code !== CODE.OK || !res.data?.access_token) {
        toast.warning(res.msg || '登录状态已失效，请重新登录');
        return;
      }
      accessToken = res.data.access_token;
      const expiresIn = Number(res.data.expires_in) > 0 ? Number(res.data.expires_in) : 7200;
      updateToken(accessToken);
      updateRefreshToken(res.data.refresh_token);
      updateTokenExpiredAt(Date.now() + expiresIn * 1000);
      updateIsTokenExpired();
    }

    const projectName = projectData.find((item) => item.id === projectId)?.name ?? '';
    const title = useCalendarStore.getState().title;
    const endTime = String(startTime + totalSeconds);

    const calendarRes = await createCalendarEvent(
      {
        data: {
          summary: projectName ? `${projectName}-${title}` : title,
          color,
          start_time: { timestamp: String(startTime) },
          end_time: { timestamp: endTime },
        },
        path: { calendar_id: calendarId },
      },
      accessToken,
    );

    const timeEntryRes = await createTimeEntries(workspaceId, {
      description: title,
      start: clockifyStartTime,
      projectId: projectId || undefined,
      end: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    });

    if (calendarRes.code === CODE.OK) {
      toast.success('创建日程成功', { position: 'bottom-right' });
      updateDescription(title);
    } else {
      toast.warning(calendarRes.msg || '创建日程失败', { position: 'bottom-right' });
    }
    if (timeEntryRes.code !== CODE.OK) {
      toast.warning(timeEntryRes.msg || '同步时间记录失败', { position: 'bottom-right' });
    }
  };

  const onStartHandle = () => {
    if (!userId) {
      toast.warning('请先登录', { position: 'bottom-right' });
      return;
    }
    setClockifyStartTime(dayjs().format('YYYY-MM-DDTHH:mm:ssZ'));
    setStartTime(Math.floor(Date.now() / 1000));
    start();
  };

  // 用 ref 防重复：原实现用 totalSeconds === 1800 精确判断，定时器跳秒会漏，
  // 且未授权时每一秒都会重复发起权限申请
  const hasNotifiedRef = useRef(false);
  useEffect(() => {
    if (totalSeconds < 1800 || hasNotifiedRef.current) return;
    if (typeof Notification === 'undefined') return;
    hasNotifiedRef.current = true;

    const notify = () => {
      new Notification('时间提醒', { body: '已经工作30分钟啦，该休息一下了！' });
    };
    if (Notification.permission === 'granted') {
      notify();
    } else if (Notification.permission !== 'denied') {
      void Notification.requestPermission().then((permission) => {
        if (permission === 'granted') notify();
      });
    }
  }, [totalSeconds]);

  const onResetHandle = () => {
    if (!userId) {
      toast.warning('请先登录', { position: 'bottom-right' });
      return;
    }
    hasNotifiedRef.current = false;
    setStartTime(Math.floor(Date.now() / 1000));
    setClockifyStartTime(dayjs().format('YYYY-MM-DDTHH:mm:ssZ'));
    reset();
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
        <Button onClick={onResetHandle} color="primary">
          Reset
        </Button>
      </div>
    </div>
  );
}
