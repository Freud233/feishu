import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Providers } from "./providers";
export const metadata: Metadata = {
  title: "时间记录",
  description: "时间记录，日历记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
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
