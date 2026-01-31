
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Edit, Trash, Check, X } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Box',
        features: [] as string[]
    });
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get('/api/admin/services');
            setServices(res.data);
        } catch (error) {
            console.error('Failed to fetch services', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service: any) => {
        setCurrentService(service);
        setFormData({
            title: service.title,
            description: service.description,
            icon: service.icon,
            features: typeof service.features === 'string' ? JSON.parse(service.features) : service.features || []
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await axios.delete(`/api/admin/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Failed to delete service', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentService) {
                await axios.put(`/api/admin/services/${currentService.id}`, formData);
            } else {
                await axios.post('/api/admin/services', formData);
            }
            setIsEditing(false);
            setCurrentService(null);
            setFormData({ title: '', description: '', icon: 'Box', features: [] });
            fetchServices();
        } catch (error) {
            console.error('Failed to save service', error);
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({ ...formData, features: [...formData.features, featureInput] });
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    if (loading) return <div>Loading services...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Services Management</h1>
                <Button onClick={() => { setIsEditing(true); setCurrentService(null); setFormData({ title: '', description: '', icon: 'Box', features: [] }); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            {isEditing && (
                <Card className="mb-8 p-6 bg-gray-900/50 border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">{currentService ? 'Edit Service' : 'New Service'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Title</label>
                            <input
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Icon Name (Lucide React)</label>
                            <input
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Features</label>
                            <div className="flex space-x-2 -2">
                                <input
                                    className="flex-1 bg-black border border-gray-700 rounded p-2 text-white"
                                    value={featureInput}
                                    onChange={e => setFeatureInput(e.target.value)}
                                    placeholder="Add a feature..."
                                />
                                <Button type="button" variant="secondary" onClick={addFeature}>Add</Button>
                            </div>
                            <ul className="mt-2 space-y-1">
                                {formData.features.map((feat, idx) => (
                                    <li key={idx} className="flex justify-between text-sm bg-gray-800 p-2 rounded">
                                        <span>{feat}</span>
                                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <Button type="submit">{currentService ? 'Update' : 'Create'}</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                    // Dynamic Icon
                    const IconComponent = (Icons as any)[service.icon] || Icons.Box;

                    return (
                        <Card key={service.id} className="p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="p-2 bg-primary/20 rounded text-primary">
                                        <IconComponent size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold">{service.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-800">
                                <Button size="sm" variant="secondary" onClick={() => handleEdit(service)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-900/20" onClick={() => handleDelete(service.id)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
