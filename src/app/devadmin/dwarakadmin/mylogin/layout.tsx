

import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/devadmin/dwarakadmin/login');
    }

    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
