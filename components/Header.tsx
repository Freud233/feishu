import { getUserInfo } from '@/actions';
import { useLarkStore, useUserInfoStore } from '@/store';
import { Avatar, Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const Header = () => {
  const { token, tokenExpiredAt } = useLarkStore();
  const { updateAvatarUrl, updateUserId, updateUsername, avatarUrl, userId, username } = useUserInfoStore();
  const { updateToken } = useLarkStore();
  const isExpired = () => {
    return new Date().getTime() < tokenExpiredAt;
  };
  const onSignOutHandle = () => {
    updateToken('');
    updateUsername('');
    updateUserId('');
    updateAvatarUrl('');
    sessionStorage.clear();
    localStorage.clear();
  };
  useEffect(() => {
    if (isExpired()) {
      console.log(123);
      if (!userId) {
        if (!token) return;
        getUserInfo(token).then((res) => {
          const { data } = res;
          if (res.code === 0) {
            updateUsername(data?.name);
            updateAvatarUrl(data?.avatar_url);
            updateUserId(data?.user_id);
          }
          console.log('🚀 ~ getUserInfo ~ res:', res);
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
