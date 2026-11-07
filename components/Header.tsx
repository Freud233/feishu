import { getUserInfo } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { CODE, LARK_LOGIN_URL } from '@/constants';
import { hasTokenExpired } from '@/lib';
import { useCalendarDescriptionStore, useLarkStore, useUserInfoStore } from '@/store';
import { Avatar, Button, Link } from '@heroui/react';
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
    sessionStorage.clear();
    localStorage.clear();
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
    <div className="m-auto flex h-16 items-center justify-between bg-jade-100 p-2">
      <div className="text-2xl font-semibold text-jade-950">LOGO</div>
      {userId ? (
        <div className="flex items-center gap-3">
          <Avatar color="primary" src={avatarUrl || undefined} alt={userId} />
          <span>{username}</span>
          <Button color="danger" className="text-jade-50" onClick={handleSignOut} size="sm">
            退出登录
          </Button>
        </div>
      ) : (
        <Button as={Link} href={`${process.env.NEXT_PUBLIC_REDIRECT_URL || LARK_LOGIN_URL}`} color="secondary">
          飞书登录
        </Button>
      )}
    </div>
  );
};

export default Header;
