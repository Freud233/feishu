'use client';

import { getLarkCalendar } from '@/actions';
import { getLarkAccessToken } from '@/actions/auth';
import { getClockifyUserInfo } from '@/actions/clockify';
import { CODE } from '@/constants';
import { Card, TimerIcon } from '@/components/ui/md3';
import { useClockifyStore, useLarkStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthPage = () => {
  const router = useRouter();
  const code = useSearchParams().get('code') || '';
  const { updateRefreshToken, updateCalendarId, updateToken, updateTokenExpiredAt, updateIsTokenExpired } =
    useLarkStore();
  const { updateClockifyUserId, updateWorkspaceId } = useClockifyStore();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onLoginHandle = async () => {
      if (!code) {
        toast.warning('缺少登录凭证，请重新登录');
        router.replace('/');
        return;
      }

      // 获取飞书用户信息
      const { data, code: resCode, msg } = await getLarkAccessToken(code);
      if (cancelled) return;
      if (resCode !== CODE.OK || !data?.access_token) {
        toast.warning(msg || '登录失败');
        router.replace('/');
        return;
      }

      updateToken(data.access_token);
      updateRefreshToken(data.refresh_token);
      updateTokenExpiredAt(Date.now() + data.expires_in * 1000);
      updateIsTokenExpired();

      const larkCalendarData = await getLarkCalendar(data.access_token);
      const calendarId = larkCalendarData?.data?.calendars?.[0]?.calendar?.calendar_id || '';
      if (calendarId) updateCalendarId(calendarId);

      // 获取 Clockify 信息，失败不阻断飞书登录
      const clockifyRes = await getClockifyUserInfo();
      if (clockifyRes.code === CODE.OK && clockifyRes.data) {
        updateWorkspaceId(clockifyRes.data.activeWorkspace ?? '');
        updateClockifyUserId(clockifyRes.data.id ?? '');
      }

      if (cancelled) return;
      toast.success('登录成功');
      // 原实现无条件 setTimeout 3 秒跳转且不清理定时器；现在登录失败立即返回，跳转可被取消
      timer = setTimeout(() => router.replace('/'), 1500);
    };

    void onLoginHandle();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card variant="elevated" className="flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
        <span className="md-avatar md-avatar--lg bg-md-primary-container text-md-on-primary-container">
          <TimerIcon />
        </span>
        <h1 className="md-type-title-lg">正在完成飞书登录</h1>
        <p className="md-type-body-md text-md-on-surface-variant">正在同步日历与 Clockify 信息，请稍候…</p>
        <span className="md-spinner md-spinner--lg mt-2 text-md-primary" aria-label="加载中" />
      </Card>
    </main>
  );
};

const Auth = () => {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
};

export default Auth;
