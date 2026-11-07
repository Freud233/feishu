'use client';

import { createCalendarEvent } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { createTimeEntries } from '@/actions/clockify';
import { CODE } from '@/constants';
import { hasTokenExpired } from '@/lib';
import { useCalendarDescriptionStore, useCalendarStore, useClockifyStore, useLarkStore } from '@/store';
import { Button, LinearProgress, PauseIcon, PlayIcon, ReplayIcon } from '@/components/ui/md3';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';
import { toast } from 'react-toastify';

/** 30 分钟专注提醒阈值，同时作为进度条上限。 */
const FOCUS_GOAL_SECONDS = 1800;
const pad = (value: number) => String(value).padStart(2, '0');

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
    if (totalSeconds < FOCUS_GOAL_SECONDS || hasNotifiedRef.current) return;
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

  const elapsedMinutes = Math.floor(totalSeconds / 60);
  const elapsedSeconds = totalSeconds % 60;

  return (
    <section className="md-card md-card--hero flex flex-col p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="md-type-title-md">专注计时</p>
          <p className="md-type-body-sm mt-1 opacity-75">暂停后自动写入飞书日程与 Clockify</p>
        </div>
        <span className="md-chip">
          <span className="md-chip--dot" />
          {isRunning ? '计时中' : '未开始'}
        </span>
      </div>

      <p className="md-type-display md-tabular my-6 text-center text-[clamp(2.25rem,9vw,3.5625rem)] leading-tight">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </p>

      <div className="mb-2 flex items-center justify-between">
        <span className="md-type-label-md opacity-75">本次专注</span>
        <span className="md-type-label-md md-tabular opacity-75">
          {pad(elapsedMinutes)}:{pad(elapsedSeconds)} / 30:00
        </span>
      </div>
      <LinearProgress value={totalSeconds} max={FOCUS_GOAL_SECONDS} label="30 分钟专注进度" />

      <div className="mt-6 flex flex-wrap gap-3">
        {isRunning ? (
          <Button variant="filled" onClick={onPauseHandle} icon={<PauseIcon />}>
            暂停并同步
          </Button>
        ) : (
          <Button variant="filled" onClick={onStartHandle} icon={<PlayIcon />} disabled={!userId}>
            开始计时
          </Button>
        )}
        <Button variant="outlined" onClick={onResetHandle} icon={<ReplayIcon />} disabled={!userId}>
          重置
        </Button>
      </div>

      {!userId ? <p className="md-type-body-sm mt-3 opacity-75">完成飞书登录后即可开始计时</p> : null}
    </section>
  );
}
