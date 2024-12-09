'use client';

import { getLarkCalendar } from '@/actions';
import { userLogin } from '@/actions/auth';
import { getUserInfo } from '@/actions/clockify';
import { useClockifyStore, useLarkStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const AuthPage = () => {
  const router = useRouter();
  const code = useSearchParams().get('code') || '';
  const { updateCalendarId, updateToken } = useLarkStore();
  const { updateClockifyUserId, updateWorkspaceId } = useClockifyStore();

  const onLoginHandle = async () => {
    // 获取飞书用户信息
    const data = await userLogin(code);
    console.log('🚀 ~ onLoginHandle ~ data:', data);
    if (data?.access_token) {
      updateToken(data.access_token);
      const larkCalendarData = await getLarkCalendar(data.access_token);
      const cls = larkCalendarData?.data?.calendars;
      if (cls) {
        const id = cls[0].calendar?.calendar_id || '';
        updateCalendarId(id);
      }
    }

    // 获取clockify信息
    const clockifyData = await getUserInfo();
    const { id, activeWorkspace } = clockifyData;
    updateWorkspaceId(activeWorkspace);
    updateClockifyUserId(id);
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };
  useEffect(() => {
    onLoginHandle();
  });
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
