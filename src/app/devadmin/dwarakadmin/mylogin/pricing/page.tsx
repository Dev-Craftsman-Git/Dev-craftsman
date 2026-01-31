'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Plan {
    id: string;
    name: string;
    type: string;
    price: number;
    currency: string;
    isPopular?: boolean;
    originalPrice?: number | null;
    features: { text: string }[];
}

export default function AdminPricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await axios.get('/api/pricing');
            setPlans(res.data);
        } catch (error) {
            console.error('Failed to fetch plans', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;

        try {
            await axios.delete(`/api/pricing/${id}`);
            setPlans(plans.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete plan');
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Pricing Plans</h1>
                    <p className="text-text-secondary">Manage your service packages and rates.</p>
                </div>
                <Button onClick={() => window.location.href = '/devadmin/dwarakadmin/mylogin/pricing/new'} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Plan
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <DollarSign className="w-12 h-12 mx-auto text-text-secondary mb-4" />
                    <h3 className="text-lg font-bold text-text-primary">No plans found</h3>
                    <p className="text-text-secondary mb-4">Get started by creating your first pricing plan.</p>
                    <Link href="/devadmin/dwarakadmin/mylogin/pricing/new">
                        <Button variant="outline">Create Plan</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`bg-card border-2 rounded-xl p-6 relative group transition-all hover:scale-[1.02] ${plan.isPopular ? 'border-primary' : 'border-border hover:border-text-secondary'}`}>
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                    POPULAR
                                </div>
                            )}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                                <p className="text-sm text-text-secondary uppercase tracking-wider">{plan.type}</p>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-text-primary">
                                        {plan.currency}{plan.price}
                                    </span>
                                    {plan.originalPrice && (
                                        <span className="ml-2 text-sm text-text-secondary line-through">
                                            {plan.currency}{plan.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <Link href={`/devadmin/dwarakadmin/mylogin/pricing/edit/${plan.id}`} className="flex-1">
                                    <Button size="sm" variant="outline" className="w-full">
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </Link>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(plan.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
