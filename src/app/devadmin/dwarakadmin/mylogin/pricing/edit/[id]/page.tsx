'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function EditPricingPlanPage() {
    const router = useRouter();
    const params = useParams();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        type: 'STUDENT',
        price: '',
        originalPrice: '',
        currency: 'INR',
        isPopular: false
    });

    const [features, setFeatures] = useState<string[]>(['']);

    useEffect(() => {
        if (params.id) {
            fetchPlan(params.id as string);
        }
    }, [params.id]);

    const fetchPlan = async (id: string) => {
        try {
            const res = await axios.get(`/api/pricing/${id}`);
            const data = res.data;
            setFormData({
                name: data.name,
                type: data.type,
                price: data.price.toString(),
                originalPrice: data.originalPrice ? data.originalPrice.toString() : '',
                currency: data.currency,
                isPopular: data.isPopular
            });
            setFeatures(data.features.map((f: any) => f.text));
        } catch (error) {
            console.error('Failed to fetch plan', error);
            alert('Failed to load plan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const addFeature = () => setFeatures([...features, '']);

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await axios.put(`/api/pricing/${params.id}`, {
                ...formData,
                features: features.filter(f => f.trim() !== '')
            });
            alert('Plan updated successfully!');
            router.push('/devadmin/dwarakadmin/mylogin/pricing');
        } catch (error) {
            console.error(error);
            alert('Failed to update plan');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href="/devadmin/dwarakadmin/mylogin/pricing" className="text-text-secondary hover:text-primary flex items-center mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pricing
                </Link>
                <h1 className="text-3xl font-bold text-text-primary">Edit Plan</h1>
            </div>

            <Card className="p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="COMMERCIAL">Commercial</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Original Price (opt)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isPopular"
                            id="isPopular"
                            checked={formData.isPopular}
                            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isPopular" className="text-sm font-medium text-text-primary">Mark as Popular/Recommended</label>
                    </div>

                    <div className="border-t border-border pt-6">
                        <label className="block text-sm font-medium text-text-secondary mb-4">Features List</label>
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={addFeature} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
