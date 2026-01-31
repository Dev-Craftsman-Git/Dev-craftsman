
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@/components/ui/Card';

export default function HistoryPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/admin/history');
                setLogs(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div>Loading history...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">User Activity History</h1>

            <div className="space-y-2">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-800 hover:border-gray-700 rounded transition-colors">
                        <div className="flex items-start space-x-4">
                            <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>
                            <div>
                                <div className="font-medium text-white">
                                    <span className="text-primary font-bold">{log.action}</span>
                                    <span className="text-gray-400 mx-2">on</span>
                                    {log.entity}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    by {log.user?.name || log.user?.email || 'Unknown User'}
                                    {log.details && <span className="ml-2 text-gray-600">({log.details})</span>}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}

                {logs.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No activity recorded yet.</div>
                )}
            </div>
        </div>
    );
}
