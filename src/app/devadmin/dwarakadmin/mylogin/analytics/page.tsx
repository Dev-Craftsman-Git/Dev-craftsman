
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await axios.get('/api/admin/analytics');
                // Format date for chart
                const formatted = res.data.map((m: any) => ({
                    ...m,
                    date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }));
                setMetrics(formatted);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    const totalVisits = metrics.reduce((acc, curr) => acc + curr.totalVisits, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Traffic Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-blue-900/10 border-blue-800">
                    <div className="text-gray-400 mb-1">Total Visits (30d)</div>
                    <div className="text-4xl font-bold text-blue-400">{totalVisits}</div>
                </Card>
            </div>

            <Card className="p-6 bg-gray-900/50 border-gray-800">
                <h3 className="text-xl font-bold mb-6">Visitor Trends</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics}>
                            <XAxis dataKey="date" stroke="#888" fontSize={12} />
                            <YAxis stroke="#888" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="totalVisits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Visits" />
                            <Bar dataKey="uniqueVisits" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Unique Visitors" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
