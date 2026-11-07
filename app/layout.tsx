import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: '时间记录',
  description: '时间记录，日历记录',
};

/** 在首帧前同步亮/暗主题：优先用户选择，其次跟随系统，避免主题闪烁。 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('md-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* react-scan 仅用于本地排查渲染，生产环境不注入第三方 CDN 脚本 */}
        {process.env.NODE_ENV === 'development' && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        )}
      </head>
      <body className="min-w-[320px]">
        <SessionProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            newestOnTop
            closeButton={false}
            hideProgressBar
            icon={false}
          />
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
