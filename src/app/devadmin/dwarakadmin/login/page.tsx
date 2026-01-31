'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('Invalid Credentials');
        } else {
            router.push('/devadmin/dwarakadmin/mylogin');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md p-8">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                    <p className="text-gray-400">Restricted Area. Authorized Personnel Only.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        label="Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/50"
                    />
                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/50"
                    />

                    {error && <p className="text-center text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                        Secure Login
                    </Button>
                </form>
            </Card>
        </div>
    );
}
