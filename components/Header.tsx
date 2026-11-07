'use client';

import { getUserInfo } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { CODE, LARK_LOGIN_URL } from '@/constants';
import { hasTokenExpired } from '@/lib';
import { useCalendarDescriptionStore, useLarkStore, useUserInfoStore } from '@/store';
import { Button, LinkButton, LogoutIcon, TimerIcon } from '@/components/ui/md3';
import { ThemeToggle } from '@/components/ui/theme';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Header = () => {
  const { updateAvatarUrl, updateUserId, updateUsername, avatarUrl, userId, username } = useUserInfoStore();
  const {
    removeToken,
    updateToken,
    updateRefreshToken,
    updateTokenExpiredAt,
    updateIsTokenExpired,
    token,
    tokenExpiredAt,
    refreshToken,
  } = useLarkStore();
  const { initDescription } = useCalendarDescriptionStore();

  const handleSignOut = () => {
    // 主题偏好属于界面设置，退出登录时保留
    const theme = localStorage.getItem('md-theme');
    sessionStorage.clear();
    localStorage.clear();
    if (theme) localStorage.setItem('md-theme', theme);
    // 统一由 store 清理 token / refreshToken / 过期时间，避免残留脏状态
    removeToken();
    updateAvatarUrl('');
    updateUserId('');
    updateUsername('');
    initDescription();
  };

  const refreshTokenIfNeeded = async () => {
    if (!token || !refreshToken || !hasTokenExpired(tokenExpiredAt)) return;
    const { code, data, msg } = await getLarkRefreshToken(token, refreshToken);
    if (code !== CODE.OK || !data?.access_token) {
      toast.warning(msg || '登录状态已失效，请重新登录');
      return;
    }
    const expiresIn = Number(data.expires_in) > 0 ? Number(data.expires_in) : 7200;
    updateToken(data.access_token);
    updateRefreshToken(data.refresh_token);
    updateTokenExpiredAt(Date.now() + expiresIn * 1000);
    updateIsTokenExpired();
  };

  const fetchUserInfoIfNeeded = async () => {
    if (userId || !token) return;
    const { code, data, msg } = await getUserInfo(token);
    if (code !== CODE.OK) {
      toast.warning(msg || '获取用户信息失败');
      return;
    }
    updateUsername(data?.name);
    updateAvatarUrl(data?.avatar_url);
    updateUserId(data?.user_id);
  };

  useEffect(() => {
    // 串行：先按需刷新 token，再用可用 token 拉用户信息
    void (async () => {
      await refreshTokenIfNeeded();
      await fetchUserInfoIfNeeded();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId, refreshToken, tokenExpiredAt]);

  return (
    <header className="md-appbar">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="md-avatar bg-md-primary-container text-md-on-primary-container">
          <TimerIcon />
        </span>
        <div className="min-w-0">
          <p className="md-type-title-lg truncate">时间记录</p>
          <p className="md-type-label-md hidden truncate text-md-on-surface-variant sm:block">
            飞书任务 · Clockify 计时
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        {userId ? (
          <>
            <span
              className="md-avatar hidden bg-md-primary-container text-md-on-primary-container sm:inline-flex"
              style={
                avatarUrl
                  ? {
                      backgroundImage: `url("${avatarUrl}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              {avatarUrl ? null : (username || '?').slice(0, 1)}
            </span>
            <span className="md-type-label-lg hidden max-w-32 truncate md:block">{username}</span>
            <Button variant="text" onClick={handleSignOut} icon={<LogoutIcon />}>
              <span className="hidden sm:inline">退出登录</span>
              <span className="sm:hidden">退出</span>
            </Button>
          </>
        ) : (
          <LinkButton href={`${process.env.NEXT_PUBLIC_REDIRECT_URL || LARK_LOGIN_URL}`}>飞书登录</LinkButton>
        )}
      </div>
    </header>
  );
};

export default Header;
