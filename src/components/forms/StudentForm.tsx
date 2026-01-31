'use client';

import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import axios from 'axios';

interface StudentFormData {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    course: string;
    year: string;
    category: string;
    plan: string;
    projectTitle: string;
    description: string;
    whatsapp: boolean;
}

export default function StudentForm({ onBack }: { onBack: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StudentFormData>();
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const onSubmit = async (data: StudentFormData) => {
        setSubmitError('');
        try {
            await axios.post('/api/inquiry', { ...data, type: 'student' });
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setSubmitError('Something went wrong. Please try again.');
        }
    };

    if (success) {
        return (
            <Card className="max-w-xl mx-auto text-center p-12">
                <h3 className="text-2xl font-bold mb-4 text-white">Application Received!</h3>
                <p className="text-text-secondary mb-8">
                    Our team will analyze your requirements and contact you shortly via email/WhatsApp.
                </p>
                <Button onClick={onBack}>Submit Another</Button>
            </Card>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold font-heading text-white">Student Application</h3>
                <button onClick={onBack} className="text-sm text-text-secondary hover:text-white underline">
                    Change Category
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Full Name"
                        {...register('fullName', { required: 'Name is required' })}
                        error={errors.fullName?.message}
                    />
                    <Input
                        label="Student Email ID"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Contact Number"
                        placeholder="+91..."
                        {...register('phone', { required: 'Phone is required' })}
                        error={errors.phone?.message}
                    />
                    <Input
                        label="College / University"
                        {...register('college', { required: 'College is required' })}
                        error={errors.college?.message}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Select
                        label="Course / Branch"
                        options={[
                            { label: 'B.Tech CSE', value: 'btech_cse' },
                            { label: 'B.Tech IT', value: 'btech_it' },
                            { label: 'B.Tech ECE', value: 'btech_ece' },
                            { label: 'MCA', value: 'mca' },
                            { label: 'BCA', value: 'bca' },
                            { label: 'M.Tech', value: 'mtech' },
                            { label: 'Other', value: 'other' },
                        ]}
                        {...register('course')}
                    />
                    <Select
                        label="Year of Study"
                        options={[
                            { label: '1st Year', value: '1' },
                            { label: '2nd Year', value: '2' },
                            { label: '3rd Year', value: '3' },
                            { label: '4th Year', value: '4' },
                            { label: 'Final Year', value: 'final' },
                        ]}
                        {...register('year')}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Select
                        label="Project Category"
                        options={[
                            { label: 'AI & Machine Learning', value: 'ai' },
                            { label: 'Web Development', value: 'web' },
                            { label: 'Mobile App', value: 'app' },
                            { label: 'IoT', value: 'iot' },
                            { label: 'Blockchain', value: 'blockchain' },
                        ]}
                        {...register('category')}
                    />
                    <Select
                        label="Selected Plan"
                        options={[
                            { label: 'Basic (₹10,000)', value: 'basic' },
                            { label: 'Standard (₹20,000)', value: 'standard' },
                            { label: 'Premium (₹30,000)', value: 'premium' },
                        ]}
                        {...register('plan')}
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

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="whatsapp" {...register('whatsapp')} className="rounded border-gray-600 bg-black/20" />
                    <label htmlFor="whatsapp" className="text-sm text-text-secondary">Receive updates via WhatsApp</label>
                </div>

                {submitError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm text-center">
                        {submitError}
                    </div>
                )}

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Submit Application
                </Button>
            </form>
        </Card>
    );
}
