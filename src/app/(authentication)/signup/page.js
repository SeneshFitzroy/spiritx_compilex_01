'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const router = useRouter();

    const passwordStrengthCheck = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[\W_]/.test(password)) strength++;
        if (strength <= 1) return 'Weak';
        if (strength === 2 || strength === 3) return 'Medium';
        if (strength >= 4) return 'Strong';
    };

    useEffect(() => {
        let newErrors = {};

        if (form.username && form.username.length < 8) {
            newErrors.username = 'Username must be at least 8 characters long.';
        }

        if (form.password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
            if (!passwordRegex.test(form.password)) {
                newErrors.password = 'Password must contain at least one lowercase, one uppercase, and one special character.';
            }
            setPasswordStrength(passwordStrengthCheck(form.password));
        } else {
            setPasswordStrength('');
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

        if (Object.keys(errors).length > 0) return;

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
            alert(data.message);
            setTimeout(() => router.push(data.redirect), data.delay);
        }
    };

    const getPasswordIndicatorColor = (strength) => {
        switch (strength) {
            case 'Weak':
                return 'bg-red-500';
            case 'Medium':
                return 'bg-yellow-400';
            case 'Strong':
                return 'bg-green-500';
            default:
                return 'bg-red-500';
        }
    };

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
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}

                        {passwordStrength && (
                            <div className="mt-2 flex items-center">
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-1 ${getPasswordIndicatorColor(passwordStrength)} ${passwordStrength === 'Weak' ? 'w-1/3' :
                                                passwordStrength === 'Medium' ? 'w-2/3' :
                                                    'w-full'
                                            }`}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">{passwordStrength}</span>
                            </div>
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
                        <Link href="/login" className="text-gray-700 font-semibold ml-1 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}