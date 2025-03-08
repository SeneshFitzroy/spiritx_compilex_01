"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

                localStorage.setItem('username', formData.username);

                if (data.redirect) {
                    router.push(data.redirect);
                } else {
                    router.push('/dashboard');
                }
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
        return <div className="flex items-center justify-center min-h-screen bg-white">Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>

                <form onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                            {errors.general}
                        </div>
                    )}

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

                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                    </div>

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