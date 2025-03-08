"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TwoFactorDialog from '@/components/TwoFactorDialog';

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
        general: ''
    });

    const [touched, setTouched] = useState({
        username: false,
        password: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
    const [twoFactorUsername, setTwoFactorUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            router.push('/dashboard');
        } else {
            setCheckingAuth(false);
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        setTouched({
            ...touched,
            [name]: true
        });
    };

    const validateForm = () => {
        let tempErrors = {
            username: '',
            password: '',
            general: ''
        };
        let isValid = true;

        if (!formData.username) {
            tempErrors.username = 'Username is required';
            isValid = false;
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    useEffect(() => {
        if (touched.username) {
            if (!formData.username) {
                setErrors(prev => ({ ...prev, username: 'Username is required' }));
            } else {
                setErrors(prev => ({ ...prev, username: '' }));
            }
        }

        if (touched.password) {
            if (!formData.password) {
                setErrors(prev => ({ ...prev, password: 'Password is required' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
    }, [formData, touched]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouched({
            username: true,
            password: true
        });

        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await fetch('/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setErrors({
                        username: data.errors?.username || '',
                        password: data.errors?.password || '',
                        general: data.errors?.general || 'Login failed. Please try again.'
                    });
                    return;
                }

                if (data.requires2FA) {
                    setTwoFactorUsername(formData.username);
                    setShowTwoFactorDialog(true);
                    return;
                }

                localStorage.setItem('username', formData.username);
                router.push(data.redirect || '/dashboard');
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    general: 'An error occurred during login. Please try again.'
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (checkingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-[#212529] p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#212529] p-4">
            <div className="w-full max-w-md bg-white rounded-xl border border-gray-100 shadow-xl p-8">
                <h1 className="text-center text-xl font-semibold tracking-tight mb-6 text-black">Login 👋</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.general && (
                        <div className="py-2 px-3 border border-gray-200 rounded-xl">
                            <p className="text-red-600 text-xs text-center">{errors.general}</p>
                        </div>
                    )}

                    <div>
                        <label className="text-sm text-black block mb-1 ml-1" htmlFor="username">Username</label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            className="w-full px-3 py-2 border text-black text-sm border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={() => setTouched({ ...touched, username: true })}
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-black block mb-1 ml-1" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border text-black text-sm border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => setTouched({ ...touched, password: true })}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                    </div>

                    <Button className="w-full rounded-full py-5" type="submit" disabled={isLoading} variant={"default"}>
                        {isLoading ? 'Signing in...' : 'Login'}
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don&apos;t have an account?
                        <Link href="/signup" className="text-gray-700 font-semibold ml-1 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>

            <TwoFactorDialog
                isOpen={showTwoFactorDialog}
                onClose={() => setShowTwoFactorDialog(false)}
                username={twoFactorUsername}
            />
        </div>
    );
}