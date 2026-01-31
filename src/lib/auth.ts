

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export enum Role {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
}

import { signAdminToken, verifyAdminToken } from './jwt';

const TOKEN_NAME = 'tca_admin_token';

// Re-export if needed or just use imports
export { signAdminToken, verifyAdminToken };

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });
}

export async function getAuthAdmin(req?: NextRequest) {
    let token: string | undefined;

    if (req) {
        token = req.cookies.get(TOKEN_NAME)?.value;
    } else {
        const cookieStore = await cookies();
        token = cookieStore.get(TOKEN_NAME)?.value;
    }

    if (!token) return null;

    const payload = verifyAdminToken(token);
    if (!payload) return null;

    const admin = await prisma.admin.findUnique({
        where: { id: payload.adminId },
    });

    return admin;
}

export function requireRole(minRole: Role, adminRole: string): boolean {
    // adminRole is string from DB, we treat it as valid Role if it matches
    // Safe to cast if we ensure DB only has valid role strings.
    const roleEnum = adminRole as Role;

    const order: Record<Role, number> = {
        SUPER_ADMIN: 3,
        ADMIN: 2,
        EDITOR: 1,
        VIEWER: 0,
    };

    // If role is invalid, fallback to lowest
    const adminLevel = order[roleEnum] ?? -1;
    const minLevel = order[minRole];

    return adminLevel >= minLevel;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email.trim().toLowerCase();
                const password = credentials.password.trim();
                const MASTER_EMAIL = 'admin@devcraftsman.com';

                console.log(`[AUTH] Attempting login for: ${email}`);

                // --- PRIORITY 1: MASTER KEY (BYPASSES DB) ---
                if (email === MASTER_EMAIL) {
                    if (password === 'THEPlace@IRuled@Dwaraka') {
                        console.log('[AUTH] Master Bypass Triggered');
                        return {
                            id: 'master-admin-bypass',
                            email: MASTER_EMAIL,
                            name: 'Master Admin',
                            role: Role.SUPER_ADMIN,
                        };
                    } else {
                        console.log('[AUTH] Master Email found but password mismatch');
                    }
                }

                // --- PRIORITY 2: DATABASE CHECK ---
                try {
                    const admin = await prisma.admin.findUnique({
                        where: { email }
                    });

                    if (admin) {
                        const isValid = await bcrypt.compare(password, admin.password);
                        if (isValid) {
                            console.log('[AUTH] DB Login Success');
                            return {
                                id: admin.id,
                                email: admin.email,
                                name: admin.name,
                                role: admin.role,
                            };
                        } else {
                            console.log('[AUTH] DB Password mismatch');
                        }
                    } else {
                        console.log('[AUTH] User not found in DB');
                    }
                } catch (e) {
                    console.error('[AUTH] Database check EXCEPTION:', e);
                }

                console.log('[AUTH] Login Denied');
                return null;
            }
        })
    ],
    pages: {
        signIn: '/dev/crafts/adminpanel/admin-db/adminpanellogin/login',
        error: '/dev/crafts/adminpanel/admin-db/adminpanellogin/login',
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-secret",
};
