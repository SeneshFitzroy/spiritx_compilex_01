"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
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
            } catch {
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
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
                <div className="text-[#FFFFFF] text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4">
            <div className="login-card relative w-full max-w-md bg-[#FFFFFF] rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="relative p-8">
                    <h1 className="login-title text-3xl font-semibold text-[#1A1A1A] mb-8 text-center">
                        Login 👋
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="p-3 bg-[#E53E3E]/10 border border-[#E53E3E]/30 text-[#E53E3E] text-sm rounded-lg">
                                {errors.general}
                            </div>
                        )}

                        <div className="form-group space-y-2">
                            <Label className="text-sm text-[#1A1A1A] font-medium" htmlFor="username">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="John Doe"
                                className={`w-full h-12 bg-gray-50 border ${errors.username ? 'border-[#E53E3E]' : 'border-gray-300'} text-[#1A1A1A] placeholder:text-gray-600 rounded-lg focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] transition-all duration-200`}
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={() => setTouched({ ...touched, username: true })}
                            />
                            {errors.username && (
                                <p className="text-[#E53E3E] text-xs">{errors.username}</p>
                            )}
                        </div>

                        <div className="form-group space-y-2">
                            <Label className="text-sm text-[#1A1A1A] font-medium" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className={`w-full h-12 bg-gray-50 border ${errors.password ? 'border-[#E53E3E]' : 'border-gray-300'} text-[#1A1A1A] placeholder:text-gray-600 rounded-lg focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] transition-all duration-200`}
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() => setTouched({ ...touched, password: true })}
                            />
                            {errors.password && (
                                <p className="text-[#E53E3E] text-xs">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            className="w-full h-12 bg-[#1A1A1A] text-[#FFFFFF] font-semibold rounded-lg hover:bg-[#333333] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                            type="submit"
                            disabled={isLoading}
                            variant="default"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-[#FFFFFF]" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </Button>

                        <div className="flex justify-center gap-1 text-sm text-gray-600 tracking-tight">
                            <span>Don&#39;t have an account?</span>
                            <Link
                                className="text-[#1A1A1A] font-medium hover:text-[#333333] hover:underline transition-colors duration-200"
                                href="/signup"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <TwoFactorDialog
                isOpen={showTwoFactorDialog}
                onClose={() => setShowTwoFactorDialog(false)}
                username={twoFactorUsername}
            />
        </div>
    );
}