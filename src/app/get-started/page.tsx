'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeProvider';
import { GraduationCap, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Footer from '@/components/sections/Footer';

import { Suspense } from 'react';

function GetStartedContent() {
    const { theme } = useTheme();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<'selection' | 'student' | 'commercial'>('selection');
    const [submitted, setSubmitted] = useState(false);

    // Initial check for query params
    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'student') setStep('student');
        if (type === 'commercial') setStep('commercial');
    }, [searchParams]);

    // Dynamic Content State
    const [content, setContent] = useState({
        heading: 'Start Your Mission',
        subheading: 'Select your category to proceed with the secure communication channel.',
        studentTitle: 'For Students',
        studentDesc: 'Academic Projects, Final Year Submissions, and Learning Modules.',
        commercialTitle: 'For Commercial',
        commercialDesc: 'Business Solutions, MVP Development, and Enterprise Software.'
    });

    // Fetch content on mount
    useEffect(() => {
        axios.get('/api/sections?page=get-started&name=selection')
            .then(res => {
                if (res.data && res.data.config) {
                    setContent(prev => ({ ...prev, ...res.data.config }));
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Initial Selection View
    if (step === 'selection') {
        const headingParts = content.heading.split(' ');
        const lastWord = headingParts.pop();
        const firstPart = headingParts.join(' ');

        return (
            <div className="min-h-screen flex flex-col pt-20">
                <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 text-white font-heading">
                            {firstPart} <span style={{ color: theme.colors.primary }}>{lastWord}</span>
                        </h1>
                        <p className="text-xl text-text-secondary">
                            {content.subheading}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                        {/* Student Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep('student')}
                            className="bg-card border border-border rounded-2xl p-10 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center mb-6 border border-border group-hover:border-primary transition-colors">
                                    <GraduationCap className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{content.studentTitle}</h3>
                                <p className="text-text-secondary mb-8 text-sm h-10">
                                    {content.studentDesc}
                                </p>
                                <div className="flex items-center text-primary text-sm font-bold tracking-widest uppercase">
                                    Select Option <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Commercial Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep('commercial')}
                            className="bg-card border border-border rounded-2xl p-10 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center mb-6 border border-border group-hover:border-primary transition-colors">
                                    <Building2 className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{content.commercialTitle}</h3>
                                <p className="text-text-secondary mb-8 text-sm h-10">
                                    {content.commercialDesc}
                                </p>
                                <div className="flex items-center text-primary text-sm font-bold tracking-widest uppercase">
                                    Select Option <ArrowRight className="ml-2 w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {submitted ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <ArrowRight className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Message Received</h2>
                        <p className="text-text-secondary mb-8">
                            We have securely transmitted your details to our team. An architect will contact you shortly.
                        </p>
                        <Button onClick={() => { setSubmitted(false); setStep('selection'); }}>Back to Home</Button>
                    </Card>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">
                                {step === 'student' ? 'Student Application' : 'Commercial Inquiry'}
                            </h2>
                            <button
                                onClick={() => setStep('selection')}
                                className="text-sm text-text-secondary hover:text-primary underline"
                            >
                                Change Category
                            </button>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8">
                            {step === 'student' ? (
                                <DynamicForm formType="student" onSubmit={() => setSubmitted(true)} />
                            ) : (
                                <DynamicForm formType="commercial" onSubmit={() => setSubmitted(true)} />
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function GetStartedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <GetStartedContent />
        </Suspense>
    );
}

// Reusable Form Input Component
const FormInput = ({ label, name, type = "text", required = false, placeholder = "", onChange }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <input
            type={type}
            name={name}
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
        />
    </div>
);

const FormSelect = ({ label, name, options, required = false, onChange }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <select
            name={name}
            required={required}
            onChange={onChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
        >
            <option value="">Select an option</option>
            {Array.isArray(options) && options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const FormTextarea = ({ label, name, required = false, rows = 4, onChange }: any) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <textarea
            name={name}
            required={required}
            rows={rows}
            onChange={onChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
        />
    </div>
);

// Dynamic Form Component
function DynamicForm({ formType, onSubmit }: { formType: 'student' | 'commercial', onSubmit: () => void }) {
    const [fields, setFields] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/forms/fields?formType=${formType}`)
            .then(res => {
                setFields(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [formType]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/submissions', { formType, ...formData });
            onSubmit();
        } catch (error) {
            alert('Error submitting form');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (fields.length === 0) {
        return <div className="text-center text-text-secondary p-8">No fields configured for this form yet.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap -mx-2">
                {fields.map((field) => {
                    const widthClass = field.width === 'half' ? 'w-full md:w-1/2 px-2' : 'w-full px-2';

                    return (
                        <div key={field.id} className={widthClass}>
                            {field.type === 'select' ? (
                                <FormSelect
                                    label={field.label}
                                    name={field.name}
                                    required={field.required}
                                    options={(() => {
                                        try {
                                            const opts = field.options ? JSON.parse(field.options) : [];
                                            return Array.isArray(opts) ? opts : [];
                                        } catch (e) {
                                            return [];
                                        }
                                    })()}
                                    onChange={handleChange}
                                />
                            ) : field.type === 'textarea' ? (
                                <FormTextarea
                                    label={field.label}
                                    name={field.name}
                                    required={field.required}
                                    onChange={handleChange}
                                />
                            ) : (
                                <FormInput
                                    label={field.label}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    onChange={handleChange}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <Button type="submit" disabled={submitting} className="w-full mt-4">
                {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
}

// ... (Keep existing FormInput, FormSelect, FormTextarea components if not redefined above, or move them here)

