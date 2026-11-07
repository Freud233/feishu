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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* react-scan 仅用于本地排查渲染，生产环境不注入第三方 CDN 脚本 */}
        {process.env.NODE_ENV === 'development' && (
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
        )}
      </head>
      <body className="min-w-[375px]">
        <SessionProvider>
          <ToastContainer />
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
