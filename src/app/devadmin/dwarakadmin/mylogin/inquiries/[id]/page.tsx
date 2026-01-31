
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

export default function InquiryDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { status: authStatus } = useSession();
    const [inquiry, setInquiry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        // Auth check disabled
        // if (authStatus === 'unauthenticated') router.push('/devadmin/dwarakadmin/mylogin/login');
        if (authStatus === 'authenticated' && id) fetchInquiry();
    }, [authStatus, id]);

    const fetchInquiry = async () => {
        try {
            const res = await axios.get(`/api/inquiry/${id}`);
            setInquiry(res.data);
            setStatus(res.data.status);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`/api/inquiry/${id}`, { status, notes: note });
            setNote('');
            fetchInquiry();
            alert('Updated successfully');
        } catch (e) {
            alert('Failed to update');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!inquiry) return <div className="p-8 text-white">Not Found</div>;

    const data = JSON.parse(inquiry.data || '{}');

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{data.projectTitle || 'Untitled'}</h1>
                                <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${inquiry.formType === 'student' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                                    {inquiry.formType}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Submitted on</p>
                                <p className="text-white">{new Date(inquiry.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Description</h3>
                                <p className="text-gray-200 bg-black/30 p-4 rounded border border-gray-800 whitespace-pre-wrap">
                                    {data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Contact Details</h3>
                                    <p className="text-white font-bold">{data.fullName || data.contactPerson}</p>
                                    <p className="text-gray-300">{data.email}</p>
                                    <p className="text-gray-300">{data.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Project Details</h3>
                                    <p className="text-gray-300"><span className="text-gray-500">Category:</span> {data.category}</p>
                                    {data.college && <p className="text-gray-300"><span className="text-gray-500">College:</span> {data.college}</p>}
                                    {data.companyName && <p className="text-gray-300"><span className="text-gray-500">Company:</span> {data.companyName}</p>}
                                    {data.budget && <p className="text-gray-300"><span className="text-gray-500">Budget:</span> {data.budget}</p>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Submission Json</h2>
                        <pre className="bg-black/50 p-4 rounded overflow-auto text-xs text-green-400 max-h-60">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-black/30 border border-gray-700 text-white rounded p-2"
                                >
                                    <option value="NEW">NEW</option>
                                    <option value="VIEWED">VIEWED</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="ARCHIVED">ARCHIVED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Add Internal Note</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full bg-black/30 border border-gray-700 text-white rounded p-2 h-24"
                                    placeholder="Private note..."
                                />
                            </div>
                            <Button className="w-full" onClick={handleUpdate}>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    </Card>

                    {inquiry.notes && inquiry.notes.length > 0 && (
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Activity Log</h2>
                            <div className="space-y-4">
                                {inquiry.notes.map((n: any) => (
                                    <div key={n.id} className="border-b border-gray-800 pb-2 last:border-0">
                                        <p className="text-sm text-gray-300">{n.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
