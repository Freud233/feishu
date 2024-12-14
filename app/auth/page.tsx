'use client';

import { getLarkCalendar } from '@/actions';
import { getLarkAccessToken } from '@/actions/auth';
import { getClockifyUserInfo } from '@/actions/clockify';
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
  const onLoginHandle = async () => {
    // 获取飞书用户信息
    const { data, code: resCode, msg } = await getLarkAccessToken(code);
    console.log('🚀 ~ onLoginHandle ~ data:', data);
    if (resCode != 0) {
      toast.warning(msg);
      return;
    }
    if (data?.access_token) {
      updateToken(data.access_token);
      updateRefreshToken(data.refresh_token);
      updateTokenExpiredAt(new Date().getTime() + data.expires_in * 1000);
      // updateTokenExpiredAt(new Date().getTime() + 10 * 1000);
      updateIsTokenExpired();
      const larkCalendarData = await getLarkCalendar(data.access_token);
      const cls = larkCalendarData?.data?.calendars;
      if (cls) {
        const id = cls[0].calendar?.calendar_id || '';
        updateCalendarId(id);
      }
    }

    // 获取clockify信息
    const clockifyData = await getClockifyUserInfo();
    const { id, activeWorkspace } = clockifyData;
    updateWorkspaceId(activeWorkspace);
    updateClockifyUserId(id);
    toast.success(msg);
  };
  useEffect(() => {
    onLoginHandle();
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [code]);
  return <div>Auth Page</div>;
};
const Auth = () => {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
};
export default Auth;
