
import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
    pages: {
        signIn: '/dev/crafts/adminpanel/admin-db/adminpanellogin/login',
    },
})

export const config = { matcher: ["/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/:path*"] }
