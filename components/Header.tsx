import { getUserInfo } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { LARK_LOGIN_URL } from '@/constants';
import { useCalendarDescriptionStore, useLarkStore, useUserInfoStore } from '@/store';
import { Avatar, Button, Link } from '@heroui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// 提取固定的时间常量，这里假设过期时间延长10秒只是示例，可根据实际需求调整
// const TOKEN_EXPIRED_EXTEND_TIME = 10 * 1000;

const Header = () => {
  const userInfoStore = useUserInfoStore();
  const { updateAvatarUrl, updateUserId, updateUsername, avatarUrl, userId, username } = userInfoStore;
  const larkStore = useLarkStore();
  const {
    updateToken,
    updateRefreshToken,
    updateTokenExpiredAt,
    updateIsTokenExpired,
    token,
    tokenExpiredAt,
    refreshToken,
  } = larkStore;
  const calendarDescriptionStore = useCalendarDescriptionStore();
  const { initDescription } = calendarDescriptionStore;

  // 提取判断令牌是否过期的逻辑到独立函数
  const isTokenExpired = () => {
    return new Date().getTime() > tokenExpiredAt;
  };

  // 提取处理登出的逻辑到独立函数
  const handleSignOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    updateToken('');
    updateAvatarUrl('');
    updateUserId('');
    updateUsername('');
    initDescription();
    console.log(userId, 'id');
  };

  // 提取刷新令牌的逻辑到独立函数
  const refreshTokenIfNeeded = () => {
    if (isTokenExpired()) {
      return getLarkRefreshToken(token, refreshToken).then((res) => {
        if (!token || !refreshToken) return;
        const { msg, data } = res;
        console.log('🚀 ~ getLarkRefreshToken ~ data:', data);
        updateToken(data?.access_token);
        updateRefreshToken(data?.refresh_token);
        updateTokenExpiredAt(new Date().getTime() + data.expires_in * 1000);
        updateIsTokenExpired();
        toast.success(msg);
      });
    }
  };

  // 提取获取用户信息的逻辑到独立函数
  const fetchUserInfoIfNeeded = () => {
    if (!userId) {
      if (!token) return;
      return getUserInfo(token).then((res) => {
        const { data, code } = res;
        console.log('🚀 ~ getUserInfo ~ code:', code);
        if (res.code === 0) {
          updateUsername(data?.name);
          updateAvatarUrl(data?.avatar_url);
          updateUserId(data?.user_id);
        }
      });
    }
  };

  useEffect(() => {
    refreshTokenIfNeeded();
    fetchUserInfoIfNeeded();
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
