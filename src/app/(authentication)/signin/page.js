"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import Link from 'next/link';

export default function Login() {
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Error state
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        general: ''
    });

    // Touched fields tracker
    const [touched, setTouched] = useState({
        username: false,
        password: false
    });

    // Loading state for form submission
    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Mark field as touched
        setTouched({
            ...touched,
            [name]: true
        });
    };

    // Validate form
    const validateForm = () => {
        let tempErrors = {
            username: '',
            password: '',
            general: ''
        };
        let isValid = true;

        // Username validation
        if (!formData.username) {
            tempErrors.username = 'Username is required';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Real-time validation
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
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
                    // Handle API errors
                    setErrors({
                        username: data.errors?.username || '',
                        password: data.errors?.password || '',
                        general: data.errors?.general || 'Login failed. Please try again.'
                    });
                    return;
                }

                // Successful login
                if (data.redirect) {
                    router.push(data.redirect);
                } else {
                    router.push('/landing');
                }
            } catch (error) {
                console.error('Login error:', error);
                setErrors(prev => ({
                    ...prev,
                    general: 'An error occurred during login. Please try again.'
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>

                <form onSubmit={handleSubmit}>
                    {/* General error message */}
                    {errors.general && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                            {errors.general}
                        </div>
                    )}

                    {/* Username field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-gray-500 text-gray-800`}
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={() => setTouched({ ...touched, username: true })}
                        />
                        {errors.username && (
                            <p className="text-red-600 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-gray-500 text-gray-800`}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => setTouched({ ...touched, password: true })}
                        />
                        {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                    </div>

                    {/* Signup link */}
                    <div className="text-center text-sm">
                        <span className="text-gray-800">Don't have an account?</span>{' '}
                        <Link href="/signup" className="text-gray-700 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}