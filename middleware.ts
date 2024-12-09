import { auth } from './auth';

export default auth((req) => {
  // console.log("🚀 ~ auth ~ req:", req)
  // req.auth
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
