import { Avatar, Button } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();
  console.log('🚀 ~ Header ~ session:', session);
  return (
    <div className="m-auto flex h-16 items-center justify-between bg-jade-100 p-2">
      <div className="text-2xl font-semibold text-jade-950">LOGO</div>
      {session ? (
        <div className="flex items-center gap-3">
          <Avatar color="primary" src={session?.user?.image || undefined} />
          <span>{session.user?.name}</span>
          <Button color="success" className="text-jade-50" onClick={() => signOut()} size="sm">
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
