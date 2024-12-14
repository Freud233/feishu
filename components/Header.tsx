import { getUserInfo } from '@/actions';
import { getLarkRefreshToken } from '@/actions/auth';
import { useLarkStore, useUserInfoStore } from '@/store';
import { Avatar, Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
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

    console.log(userId, 'id');
  };

  useEffect(() => {
    console.log('🚀 ~ isExpired ~ isExpired:', isExpired());
    console.log(token, refreshToken, 'token', 'refresh token');
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
  });
  return (
    <div className="m-auto flex h-16 items-center justify-between bg-jade-100 p-2">
      <div className="text-2xl font-semibold text-jade-950">LOGO</div>
      {userId ? (
        <div className="flex items-center gap-3">
          <Avatar color="primary" src={avatarUrl || undefined} alt={userId} />
          <span>{username}</span>
          <Button color="success" className="text-jade-50" onClick={onSignOutHandle} size="sm">
            退出登录
          </Button>
        </div>
      ) : (
        <Button color="success" className="text-xl text-jade-50" onClick={() => signIn()}>
          登录
        </Button>
      )}
    </div>
  );
};
export default Header;
