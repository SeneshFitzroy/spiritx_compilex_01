"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import Link from 'next/link';

export default function Signup() {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState([]);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            router.push('/dashboard');
        } else {
            setCheckingAuth(false);
        }
    }, [router]);

    const validatePasswordStrength = (password) => {
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        return strength;
    };

    useEffect(() => {
        let newErrors = {};
        let newMissingRequirements = [];

        if (form.username && form.username.length < 8) {
            newErrors.username = 'Username must be at least 8 characters long.';
        }

        if (form.password) {
            if (!/[a-z]/.test(form.password)) {
                newMissingRequirements.push('lowercase');
            }
            if (!/[A-Z]/.test(form.password)) {
                newMissingRequirements.push('uppercase');
            }
            if (!/[^A-Za-z0-9]/.test(form.password)) {
                newMissingRequirements.push('special character');
            }

            if (newMissingRequirements.length > 0) {
                newErrors.password = true;
            }

            setMissingRequirements(newMissingRequirements);
            setPasswordStrength(validatePasswordStrength(form.password));
        } else {
            setPasswordStrength(0);
            setMissingRequirements([]);
        }

        if (form.confirmPassword && form.confirmPassword !== form.password) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
    }, [form]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setAuthError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password || !form.confirmPassword) {
            setErrors({
                username: !form.username ? 'Username is required.' : errors.username,
                password: !form.password ? 'Password is required.' : errors.password,
                confirmPassword: !form.confirmPassword ? 'Confirm password is required.' : errors.confirmPassword,
            });
            return;
        }

        if (missingRequirements.length > 0 || Object.keys(errors).length > 0) return;

        try {
            setIsLoading(true);
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrors(data.errors || {});
                if (data.errors && data.errors.auth) {
                    setAuthError(data.errors.auth);
                }
            } else {
                setShowConfirmation(true);
                setTimeout(() => router.push('/signin'), 2000);
            }
        } catch {
            setAuthError('Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatMissingRequirements = () => {
        if (missingRequirements.length === 0) return '';

        if (missingRequirements.length === 1) {
            return `Password must contain at least one ${missingRequirements[0]}.`;
        }

        const lastRequirement = missingRequirements.pop();
        const message = `Password must contain at least one ${missingRequirements.join(', ')}, and one ${lastRequirement}.`;
        missingRequirements.push(lastRequirement);

        return message;
    };

    const renderPasswordStrength = () => {
        const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

        return (
            <div className="mt-2 mb-1">
                <div className="flex mb-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className={`h-2 w-full mx-1 rounded-sm ${index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
                {form.password && (
                    <p className="text-xs text-gray-600">
                        Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Very Weak'}
                    </p>
                )}
            </div>
        );
    };

    const confirmationDialog = () => {
        if (!showConfirmation) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg text-center max-w-md mx-4 border border-gray-200">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Registration Successful!</h2>
                    <p className="text-[#1A1A1A]">Your account has been created successfully.</p>
                    <p className="mt-2 text-sm text-gray-600">Redirecting to sign in page...</p>
                    <div className="mt-4 w-full bg-gray-300 rounded-full h-1">
                        <div className="bg-[#1A1A1A] h-1 rounded-full animate-[progress_2s_linear]"></div>
                    </div>
                </div>
            </div>
        );
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
                <Loader className="animate-spin"></Loader>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4">
            <div className="w-full max-w-md bg-[#FFFFFF] rounded-xl border border-gray-200 shadow-xl p-8">
                <h1 className="text-center text-3xl font-semibold tracking-tight mb-8 text-[#1A1A1A]">
                    Create an account 🔑
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="form-group space-y-2">
                        <Label className="text-sm text-[#1A1A1A] font-medium" htmlFor="username">
                            Username
                        </Label>
                        <Input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full h-12 bg-gray-50 border text-[#1A1A1A] text-sm border-gray-300 rounded-lg focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="text-[#E53E3E] text-xs mt-1 ml-1">{errors.username}</p>}
                    </div>

                    <div className="form-group space-y-2">
                        <Label className="text-sm text-[#1A1A1A] font-medium" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full h-12 bg-gray-50 border text-[#1A1A1A] text-sm border-gray-300 rounded-lg focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="Enter password"
                        />
                        {renderPasswordStrength()}
                        {missingRequirements.length > 0 && (
                            <p className="text-[#E53E3E] text-xs mt-1 ml-1">{formatMissingRequirements()}</p>
                        )}
                    </div>

                    <div className="form-group space-y-2">
                        <Label className="text-sm text-[#1A1A1A] block mb-1 ml-1">Confirm Password</Label>
                        <Input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full h-12 bg-gray-50 border text-[#1A1A1A] text-sm border-gray-300 rounded-lg focus:outline-none focus:border-[#1A1A1A] transition-colors"
                            placeholder="Confirm password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-[#E53E3E] text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {authError && (
                        <div className="py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl">
                            <p className="text-[#E53E3E] text-xs text-center">{authError}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#1A1A1A] text-[#FFFFFF] font-semibold rounded-lg hover:bg-[#333333] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-[#FFFFFF]" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Creating an account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?
                        <Link href="/signin" className="text-[#1A1A1A] font-semibold ml-1 hover:text-[#333333] hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>

            {confirmationDialog()}
        </div>
    );
}