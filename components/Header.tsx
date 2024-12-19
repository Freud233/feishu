import { getUserInfo } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { LARK_LOGIN_URL } from '@/constants';
import { useCalendarDescriptionStore, useLarkStore, useUserInfoStore } from '@/store';
import { Avatar, Button, Link } from '@nextui-org/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Header = () => {
  const { updateAvatarUrl, updateUserId, updateUsername, avatarUrl, userId, username } = useUserInfoStore();
  const {
    updateToken,
    updateRefreshToken,
    updateTokenExpiredAt,
    updateIsTokenExpired,
    token,
    tokenExpiredAt,
    refreshToken,
  } = useLarkStore();
  const { initDescription } = useCalendarDescriptionStore();
  const isExpired = () => {
    return new Date().getTime() > tokenExpiredAt;
  };
  const onSignOutHandle = () => {
    sessionStorage.clear();
    localStorage.clear();
    updateToken('');
    updateAvatarUrl('');
    updateUserId('');
    updateUsername('');
    initDescription();
    console.log(userId, 'id');
  };

  useEffect(() => {
    if (isExpired()) {
      getLarkRefreshToken(token, refreshToken).then((res) => {
        if (!token || !refreshToken) return;
        const { msg, data } = res;
        console.log('🚀 ~ getLarkRefreshToken ~ data:', data);
        updateToken(data?.access_token);
        updateRefreshToken(data?.refresh_token);
        updateTokenExpiredAt(new Date().getTime() + data.expires_in * 1000);
        // updateTokenExpiredAt(new Date().getTime() + 10 * 1000);
        updateIsTokenExpired();
        toast.success(msg);
      });
    } else {
      if (!userId) {
        if (!token) return;
        getUserInfo(token).then((res) => {
          const { data, code } = res;
          console.log('🚀 ~ getUserInfo ~ code:', code);
          if (res.code === 0) {
            updateUsername(data?.name);
            updateAvatarUrl(data?.avatar_url);
            updateUserId(data?.user_id);
          }
        });
      }
    }
  }, [token, userId, refreshToken, tokenExpiredAt]);
  return (
    <div className="m-auto flex h-16 items-center justify-between bg-jade-100 p-2">
      <div className="text-2xl font-semibold text-jade-950">LOGO</div>
      {userId ? (
        <div className="flex items-center gap-3">
          <Avatar color="primary" src={avatarUrl || undefined} alt={userId} />
          <span>{username}</span>
          <Button color="danger" className="text-jade-50" onClick={onSignOutHandle} size="sm">
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
