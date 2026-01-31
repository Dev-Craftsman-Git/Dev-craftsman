'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Edit2, X, Save, GripVertical, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

type FormField = {
    id: string;
    formType: 'student' | 'commercial';
    label: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
    placeholder?: string;
    required: boolean;
    options?: string; // JSON string
    width: 'full' | 'half';
    order: number;
};

export default function AdminFormsPage() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(true);
    const [formType, setFormType] = useState<'student' | 'commercial'>('student');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<Partial<FormField> | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [isSaving, setIsSaving] = useState(false);

    // Form data for the modal
    const [formData, setFormData] = useState<{
        label: string;
        name: string;
        type: string;
        placeholder: string;
        required: boolean;
        width: string;
        options: string; // Comma separated for UI simple editing
    }>({
        label: '',
        name: '',
        type: 'text',
        placeholder: '',
        required: true,
        width: 'full',
        options: ''
    });

    useEffect(() => {
        fetchFields();
    }, [formType]);

    const fetchFields = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/forms/fields?formType=${formType}`);
            setFields(res.data);
        } catch (error) {
            console.error('Failed to fetch fields', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadDefaults = async () => {
        if (!confirm('This will add standard fields to the current form. Continue?')) return;
        setIsSaving(true);
        try {
            const studentDefaults = [
                { label: 'Full Name', name: 'fullName', type: 'text', required: true, width: 'half', order: 1 },
                { label: 'Student Email ID', name: 'email', type: 'email', required: true, width: 'half', order: 2 },
                { label: 'Contact Number', name: 'phone', type: 'tel', placeholder: '+91...', required: true, width: 'half', order: 3 },
                { label: 'College / University', name: 'college', type: 'text', required: true, width: 'half', order: 4 },
                { label: 'Course / Branch', name: 'course', type: 'select', options: JSON.stringify(['CSE', 'IT', 'ECE', 'Mechanical', 'Other']), required: true, width: 'half', order: 5 },
                { label: 'Year of Study', name: 'year', type: 'select', options: JSON.stringify(['1st Year', '2nd Year', '3rd Year', 'Final Year']), required: true, width: 'half', order: 6 },
                { label: 'Project Category', name: 'category', type: 'select', options: JSON.stringify(['Web Development', 'App Development', 'AI/ML', 'IoT', 'Blockchain']), required: true, width: 'half', order: 7 },
                { label: 'Selected Plan', name: 'plan', type: 'select', options: JSON.stringify(['Basic', 'Standard', 'Premium']), required: true, width: 'half', order: 8 },
                { label: 'Project Title', name: 'title', type: 'text', required: true, width: 'full', order: 9 },
                { label: 'Project Description', name: 'description', type: 'textarea', required: true, width: 'full', order: 10 },
            ];

            const commercialDefaults = [
                { label: 'Company / Business Name', name: 'companyName', type: 'text', required: true, width: 'half', order: 1 },
                { label: 'Contact Person Name', name: 'contactPerson', type: 'text', required: true, width: 'half', order: 2 },
                { label: 'Business Email', name: 'email', type: 'email', required: true, width: 'half', order: 3 },
                { label: 'Contact Number', name: 'phone', type: 'tel', placeholder: '+91...', required: true, width: 'half', order: 4 },
                { label: 'Industry Type', name: 'industry', type: 'select', options: JSON.stringify(['Technology', 'Education', 'Healthcare', 'Retail', 'Finance', 'Other']), required: true, width: 'half', order: 5 },
                { label: 'Budget Range', name: 'budget', type: 'select', options: JSON.stringify(['< ₹50k', '₹50k - ₹1L', '₹1L - ₹5L', '> ₹5L']), required: true, width: 'half', order: 6 },
                { label: 'Project Category', name: 'category', type: 'select', options: JSON.stringify(['Web App', 'Mobile App', 'Enterprise Software', 'E-commerce', 'Consulting']), required: true, width: 'half', order: 7 },
                { label: 'Expected Timeline', name: 'timeline', type: 'text', placeholder: 'e.g. 2 months', required: true, width: 'half', order: 8 },
                { label: 'Project Title', name: 'title', type: 'text', required: true, width: 'full', order: 9 },
                { label: 'Project Description', name: 'description', type: 'textarea', required: true, width: 'full', order: 10 },
            ];

            const fieldsToAdd = formType === 'student' ? studentDefaults : commercialDefaults;

            for (const field of fieldsToAdd) {
                await axios.post('/api/forms/fields', { formType, ...field });
            }

            fetchFields();
            alert('Default fields loaded!');
        } catch (error) {
            console.error(error);
            alert('Failed to load defaults');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this field?')) return;
        try {
            await axios.delete(`/api/forms/fields/${id}`);
            setFields(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            alert('Failed to delete field');
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            label: '',
            name: '', // Optional, will be generated if empty
            type: 'text',
            placeholder: '',
            required: true,
            width: 'full',
            options: ''
        });
        setCurrentField(null);
        setIsModalOpen(true);
    };

    const openEditModal = (field: FormField) => {
        setModalMode('edit');
        let optionsStr = '';
        if (field.options) {
            try {
                const parsed = JSON.parse(field.options);
                if (Array.isArray(parsed)) optionsStr = parsed.join(', ');
            } catch (e) { }
        }

        setFormData({
            label: field.label,
            name: field.name,
            type: field.type,
            placeholder: field.placeholder || '',
            required: field.required,
            width: field.width,
            options: optionsStr
        });
        setCurrentField(field);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const optionsArray = formData.options.split(',').map(s => s.trim()).filter(Boolean);

            const payload = {
                formType,
                label: formData.label,
                name: formData.name, // If empty, backend handles it or we could slugify here
                type: formData.type,
                placeholder: formData.placeholder,
                required: formData.required,
                width: formData.width,
                options: optionsArray.length > 0 ? optionsArray : undefined,
            };

            if (modalMode === 'add') {
                const res = await axios.post('/api/forms/fields', payload);
                setFields(prev => [...prev, res.data]);
            } else {
                if (!currentField?.id) return;
                const res = await axios.patch(`/api/forms/fields/${currentField.id}`, payload);
                setFields(prev => prev.map(f => f.id === currentField.id ? res.data : f));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving field:", error);
            alert('Failed to save field');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Form Builder</h1>
                    <p className="text-text-secondary">Manage fields for public fields.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleLoadDefaults} disabled={loading || isSaving}>
                        Load Defaults
                    </Button>
                    <Button onClick={openAddModal} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Field
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-[var(--border-color)]">
                {(['student', 'commercial'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setFormType(t)}
                        className={`px-6 py-3 font-medium text-sm transition-colors relative ${formType === t
                            ? 'text-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {t === 'student' ? 'Student Application' : 'Commercial Inquiry'}
                        {formType === t && (
                            <motion.div
                                layoutId="activeFormTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Field List */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : fields.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <Settings className="h-12 w-12 text-text-secondary mx-auto mb-4 opacity-50" />
                    <p className="text-text-secondary mb-4">No fields configured for this form.</p>
                    <Button variant="outline" onClick={openAddModal}>Add First Field</Button>
                </Card>
            ) : (
                <div className="space-y-3">
                    {fields.map((field) => (
                        <Card key={field.id} className="p-4 flex items-center gap-4 group hover:border-primary transition-all">
                            <div className="text-text-secondary cursor-grab active:cursor-grabbing p-2 hover:bg-background rounded">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-text-primary">{field.label}</span>
                                    {field.required && <span className="text-xs text-red-500 font-bold px-1.5 py-0.5 bg-red-500/10 rounded">Required</span>}
                                    <span className="text-xs bg-background px-2 py-1 rounded text-text-secondary border border-border">
                                        {field.type}
                                    </span>
                                    <span className="text-xs text-text-secondary font-mono opacity-50">
                                        {field.name}
                                    </span>
                                </div>
                                {field.type === 'select' && (
                                    <p className="text-xs text-text-secondary mt-1 truncate max-w-md">
                                        Options: {(() => {
                                            try {
                                                const opts = JSON.parse(field.options || '[]');
                                                return Array.isArray(opts) ? opts.join(', ') : field.options;
                                            } catch (e) {
                                                return field.options;
                                            }
                                        })()}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(field)}
                                    className="p-2 hover:bg-primary/10 text-text-secondary hover:text-primary rounded-full transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(field.id)}
                                    className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold text-text-primary">
                                    {modalMode === 'add' ? 'Add Field' : 'Edit Field'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Full Name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Field Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="text">Text Input</option>
                                            <option value="email">Email</option>
                                            <option value="tel">Phone</option>
                                            <option value="textarea">Text Area</option>
                                            <option value="select">Dropdown (Select)</option>
                                            <option value="date">Date</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Width</label>
                                        <select
                                            value={formData.width}
                                            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="full">Full Width</option>
                                            <option value="half">Half Width (50%)</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.type === 'select' && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Options (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.options}
                                            onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Option 1, Option 2, Option 3"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Placeholder</label>
                                    <input
                                        type="text"
                                        value={formData.placeholder}
                                        onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="e.g. Enter your name..."
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="required"
                                        checked={formData.required}
                                        onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="required" className="text-sm font-medium text-text-primary cursor-pointer">
                                        Required Field
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-xs font-medium text-text-secondary mb-1">
                                        System Name (Optional override)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg p-2 text-text-primary text-sm focus:ring-2 focus:ring-primary outline-none font-mono"
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card">
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
                                            Save Field
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
