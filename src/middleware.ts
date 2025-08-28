// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    /*
     * Cocokkan semua path di bawah /admin,
     * KECUALI yang merupakan halaman login itu sendiri.
     * '/admin' (tanpa '/login') juga harus dilindungi.
     */
    "/admin/:path*",
    "/admin",
  ],
};