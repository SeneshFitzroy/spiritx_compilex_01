'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState([]);
    const [checkingAuth, setCheckingAuth] = useState(true);
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
        } catch (error) {
            setAuthError('Signup failed. Please try again.');
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
                            className={`h-2 w-full mx-1 rounded-sm ${index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                                }`}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
                    <p>Your account has been created successfully.</p>
                    <p className="mt-2 text-sm text-gray-600">Redirecting to sign in page...</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-green-600 h-1 rounded-full animate-[progress_2s_linear]"></div>
                    </div>
                </div>
            </div>
        );
    };

    if (checkingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-white p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-md bg-white rounded-xl border border-gray-100 shadow-xl p-8">
                <h1 className="text-center text-xl font-semibold tracking-tight mb-6 text-black">Create an account</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm text-black block mb-1 ml-1">Username</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border text-black text-sm border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-black block mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border text-black text-sm border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                            placeholder="Enter password"
                        />
                        {renderPasswordStrength()}
                        {missingRequirements.length > 0 && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{formatMissingRequirements()}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-black block mb-1 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border text-black text-sm border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                            placeholder="Confirm password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                    </div>

                    {authError && (
                        <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <p className="text-red-600 text-xs text-center">{authError}</p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-2 bg-black text-white text-sm tracking-tight font-semibold rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Sign up
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Already have an account?
                        <Link href="/signin" className="text-gray-700 font-semibold ml-1 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>

            {confirmationDialog()}
        </div>
    );
}