
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAdminToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password required' },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = signAdminToken({ adminId: admin.id, role: admin.role });
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Logged in',
            admin: { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
        });
    } catch (err) {
        console.error('Login error', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
