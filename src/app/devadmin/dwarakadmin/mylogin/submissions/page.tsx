'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Inbox, Calendar, Plus, Trash2, Edit2, X, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

type Submission = {
    id: string;
    formType: 'student' | 'commercial';
    data: string; // JSON string
    status: string;
    priority: string;
    createdAt: string;
};

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'student' | 'commercial'>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState<Partial<Submission> | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState({
        formType: 'student',
        status: 'NEW',
        priority: 'NORMAL',
        dataContent: '{}'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/submissions');
            setSubmissions(res.data);
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) return;

        try {
            await axios.delete(`/api/submissions/${id}`);
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete submission', error);
            alert('Failed to delete submission');
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            formType: 'student',
            status: 'NEW',
            priority: 'NORMAL',
            dataContent: '{\n  "title": "",\n  "description": "",\n  "email": ""\n}'
        });
        setCurrentSubmission(null);
        setIsModalOpen(true);
    };

    const openEditModal = (submission: Submission) => {
        setModalMode('edit');
        setFormData({
            formType: submission.formType,
            status: submission.status,
            priority: submission.priority,
            dataContent: JSON.stringify(JSON.parse(submission.data), null, 2)
        });
        setCurrentSubmission(submission);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Validate JSON
            let parsedData;
            try {
                parsedData = JSON.parse(formData.dataContent);
            } catch (e) {
                alert('Invalid JSON in Data Content field');
                setIsSaving(false);
                return;
            }

            if (modalMode === 'add') {
                const payload = {
                    formType: formData.formType,
                    ...parsedData, // Spread the parsed data as the top level for the POST route to handle
                    status: formData.status,
                    priority: formData.priority
                };

                // Note: The existing POST route expects { formType, ...formData }. 
                // We should probably adapt it or use the data field structured way if we modified the POST route.
                // The current api/submissions/route.ts takes formType and spreads the rest into data JSON.
                // So passing status/priority in the body might put them into data JSON if not extracted.
                // Let's check the route again.
                // Route: const { formType, ...formData } = body;
                // It puts formData into data field. It sets status to 'NEW' hardcoded.
                // So actually, for 'add', we can't easily set status/priority with current generic POST route without modifying it.
                // But typically for 'add', defaults are fine.
                // However, admin might want to set status. 
                // Let's assume for now we just create it and then if needed update it, or better, 
                // we should update the POST route to accept status/priority if provided.

                // For now, I will just send the payload.
                const res = await axios.post('/api/submissions', payload);
                setSubmissions(prev => [res.data, ...prev]);
                // Wait, res.data from POST only returns { message, id }. We need to fetch again or construct the object.
                fetchSubmissions();
            } else {
                // Edit
                if (!currentSubmission?.id) return;

                const payload = {
                    formType: formData.formType,
                    status: formData.status,
                    priority: formData.priority,
                    data: formData.dataContent // The [id] route handles this
                };

                const res = await axios.patch(`/api/submissions/${currentSubmission.id}`, payload);
                setSubmissions(prev => prev.map(s => s.id === currentSubmission.id ? res.data : s));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save', error);
            alert('Failed to save submission');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredSubmissions = submissions.filter(s => {
        if (filter === 'all') return true;
        return s.formType === filter;
    });

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Inquiries & Applications</h1>
                    <p className="text-text-secondary">Manage student applications and commercial inquiries.</p>
                </div>
                <Button onClick={openAddModal} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Submission
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 border-b border-[var(--border-color)] pb-1">
                {(['all', 'student', 'commercial'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative ${filter === f
                            ? 'text-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {filter === f && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <Card className="p-12 text-center">
                    <Inbox className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No submissions found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredSubmissions.map((submission) => {
                            let data: any = {};
                            try {
                                data = JSON.parse(submission.data);
                            } catch (e) {
                                data = { error: "Invalid JSON data" };
                            }

                            return (
                                <motion.div
                                    key={submission.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <Card className="p-6 transition-all hover:border-primary group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${submission.formType === 'student'
                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        }`}>
                                                        {submission.formType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${submission.status === 'NEW' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                        submission.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                            'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                        }`}>
                                                        {submission.status}
                                                    </span>
                                                    <span className="text-xs text-text-secondary flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(submission.createdAt).toLocaleString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-text-primary mb-1">
                                                    {data.title || data.name || data.company || 'Untitled Submission'}
                                                </h3>

                                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-text-secondary mt-2">
                                                    {Object.entries(data).slice(0, 4).map(([key, value]) => {
                                                        if (key === 'description' || key === 'title' || typeof value === 'object') return null;
                                                        return (
                                                            <div key={key} className="flex gap-2">
                                                                <span className="font-semibold text-text-primary capitalize opacity-70">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                                <span className='truncate'>{String(value)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-start">
                                                <button
                                                    onClick={() => openEditModal(submission)}
                                                    className="p-2 hover:bg-primary/10 text-text-secondary hover:text-primary rounded-full transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(submission.id)}
                                                    className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                                <h2 className="text-xl font-bold text-text-primary">
                                    {modalMode === 'add' ? 'New Submission' : 'Edit Submission'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                                        <select
                                            value={formData.formType}
                                            onChange={(e) => setFormData({ ...formData, formType: e.target.value as any })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                            disabled={modalMode === 'edit'} // Usually type shouldn't change, but ok to update if needed. Let's keep it disabled for integrity or enabled? Disabled is safer.
                                        >
                                            <option value="student">Student Application</option>
                                            <option value="commercial">Commercial Inquiry</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="NEW">New</option>
                                            <option value="VIEWED">Viewed</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="ARCHIVED">Archived</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="NORMAL">Normal</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Data (JSON Format)
                                        <span className="text-xs text-text-secondary ml-2 opacity-70 font-normal">
                                            Edit the raw data for maximum control.
                                        </span>
                                    </label>
                                    <textarea
                                        value={formData.dataContent}
                                        onChange={(e) => setFormData({ ...formData, dataContent: e.target.value })}
                                        className="w-full h-64 bg-background border border-border rounded-lg p-4 font-mono text-sm text-text-primary focus:ring-2 focus:ring-primary outline-none resize-none"
                                        spellCheck={false}
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card z-10">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
