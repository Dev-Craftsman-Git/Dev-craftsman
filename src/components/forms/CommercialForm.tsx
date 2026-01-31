'use client';

import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import axios from 'axios';

interface CommercialFormData {
    company: string;
    fullName: string;
    email: string;
    phone: string;
    industry: string;
    budget: string;
    category: string;
    timeline: string;
    projectTitle: string;
    description: string;
}

export default function CommercialForm({ onBack }: { onBack: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CommercialFormData>();
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const onSubmit = async (data: CommercialFormData) => {
        setSubmitError('');
        try {
            await axios.post('/api/inquiry', { ...data, type: 'commercial' });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setSubmitError('Something went wrong. Please try again.');
        }
    };

    if (success) {
        return (
            <Card className="max-w-xl mx-auto text-center p-12">
                <h3 className="text-2xl font-bold mb-4 text-white">Inquiry Sent!</h3>
                <p className="text-text-secondary mb-8">
                    Our business development team will review your requirements and get back to you within 24 hours.
                </p>
                <Button onClick={onBack}>Submit Another</Button>
            </Card>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold font-heading text-white">Commercial Inquiry</h3>
                <button onClick={onBack} className="text-sm text-text-secondary hover:text-white underline">
                    Change Category
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Company / Business Name"
                        {...register('company', { required: 'Company name is required' })}
                        error={errors.company?.message}
                    />
                    <Input
                        label="Contact Person Name"
                        {...register('fullName', { required: 'Name is required' })}
                        error={errors.fullName?.message}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Business Email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Contact Number"
                        placeholder="+91..."
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone?.message}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Select
                        label="Industry Type"
                        options={[
                            { label: 'Technology', value: 'tech' },
                            { label: 'Healthcare', value: 'health' },
                            { label: 'Education', value: 'education' },
                            { label: 'Finance', value: 'finance' },
                            { label: 'Retail', value: 'retail' },
                            { label: 'Other', value: 'other' },
                        ]}
                        {...register('industry')}
                    />
                    <Select
                        label="Budget Range"
                        options={[
                            { label: '₹50k - ₹1L', value: '50-100k' },
                            { label: '₹1L - ₹5L', value: '100k-500k' },
                            { label: '₹5L - ₹10L', value: '500k-1m' },
                            { label: '₹10L+', value: '1m+' },
                        ]}
                        {...register('budget')}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Select
                        label="Project Category"
                        options={[
                            { label: 'Full Product Development', value: 'product' },
                            { label: 'MVP Development', value: 'mvp' },
                            { label: 'Consulting', value: 'consulting' },
                        ]}
                        {...register('category')}
                    />
                    <Input
                        label="Expected Timeline"
                        placeholder="e.g. 2 months"
                        {...register('timeline')}
                    />
                </div>

                <Input
                    label="Project Title"
                    {...register('projectTitle', { required: 'Title is required' })}
                    error={errors.projectTitle?.message}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Project Description</label>
                    <textarea
                        className="w-full rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-text-primary min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                        {...register('description', { required: 'Description is required' })}
                    ></textarea>
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                {submitError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm text-center">
                        {submitError}
                    </div>
                )}

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Submit Request
                </Button>
            </form>
        </Card>
    );
}

