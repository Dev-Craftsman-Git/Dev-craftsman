'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, FolderKanban, DollarSign, Inbox, ArrowRight, User, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Link from 'next/link';

type DashboardData = {
    stats: {
        totalProjects: number;
        totalPricingPlans: number;
        totalSubmissions: number;
    };
    recentSubmissions: {
        id: string;
        formType: string;
        data: string;
        createdAt: string;
        status: string;
    }[];
};

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/admin/dashboard');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div className="p-8">Failed to load data.</div>;

    const { stats, recentSubmissions } = data;

    return (
        <div className="p-8 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-text-secondary">Overview of your platform's activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                    icon={FolderKanban}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                    href="/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/projects"
                />
                <StatCard
                    title="Pricing Plans"
                    value={stats.totalPricingPlans}
                    icon={DollarSign}
                    color="text-green-500"
                    bg="bg-green-500/10"
                    href="/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/pricing"
                />
                <StatCard
                    title="Total Inquiries"
                    value={stats.totalSubmissions}
                    icon={Inbox}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                    href="/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/submissions"
                />
            </div>

            {/* Recent Submissions */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text-primary">Recent Inquiries</h2>
                    <Link href="/dev/crafts/adminpanel/admin-db/adminpanellogin/mylogin/submissions" className="text-sm text-primary hover:underline flex items-center">
                        View All <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>

                <Card className="overflow-hidden p-0">
                    {recentSubmissions.length === 0 ? (
                        <div className="p-8 text-center text-text-secondary">
                            No inquiries yet.
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-background/50 text-text-secondary border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Name / Company</th>
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentSubmissions.map((sub) => {
                                        const parsedData = JSON.parse(sub.data);
                                        const name = sub.formType === 'student' ? parsedData.fullName : parsedData.companyName;

                                        return (
                                            <tr key={sub.id} className="hover:bg-background/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${sub.formType === 'student'
                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        }`}>
                                                        {sub.formType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-text-primary">
                                                    {name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">
                                                    {new Date(sub.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded text-xs bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                                        {sub.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg, href }: any) {
    return (
        <Link href={href}>
            <Card className="p-6 transition-transform hover:scale-[1.02] cursor-pointer border border-border hover:border-primary group">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}
