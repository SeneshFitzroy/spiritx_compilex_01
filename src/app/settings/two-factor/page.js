"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import styles from '../../dashboard/Home.module.css';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Loader } from 'lucide-react';

export default function TwoFactorSetup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [setupMode, setSetupMode] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuthAndGet2FAStatus = async () => {
            try {
                const storedUsername = localStorage.getItem('username');
                if (!storedUsername) {
                    router.push('/signin');
                    return;
                }

                setUsername(storedUsername);

                const response = await fetch('/api/user/status', {
                    headers: {
                        'X-Username': storedUsername,
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    setError('Failed to fetch 2FA status. Please try refreshing.');
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();
                setIs2FAEnabled(data.is2FAEnabled);
                setIsLoading(false);
            } catch {
                setError('Error checking 2FA status. Please try refreshing.');
                setIsLoading(false);
            }
        };

        checkAuthAndGet2FAStatus();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('username');
        setUsername('Guest');
        router.push('/signin');
    };

    const initiateSetup = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/2fa/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                credentials: 'include',
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate 2FA setup');
            }

            const data = await response.json();
            setQrCodeUrl(data.qrCodeUrl);
            setSecret(data.secret);
            setSetupMode(true);
        } catch {
            setError(`Failed to initialize 2FA setup`);
        } finally {
            setIsLoading(false);
        }
    };

    const completeSetup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await fetch('/api/user/user2faSecret', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    secret: secret
                }),
            });

            const response = await fetch('/api/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                credentials: 'include',
                body: JSON.stringify({
                    token: verificationCode,
                    secret: secret,
                    username: username
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Verification failed. Please try again.');
                return;
            }

            setIs2FAEnabled(true);
            setSetupMode(false);
            setSuccess('Two-factor authentication has been successfully enabled for your account.');
            setVerificationCode('');

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch {
            setError('An error occurred during verification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const disable2FA = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/2fa/disable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Username': username
                },
                credentials: 'include',
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to disable 2FA');
            }

            setIs2FAEnabled(false);
            setSuccess('Two-factor authentication has been successfully disabled for your account.');

            setTimeout(() => {
                window.location.href = window.location.href;
            }, 1500);
        } catch {
            setError('Failed to disable 2FA. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
                <Loader className="animate-spin"></Loader>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1A1A1A]">

            <header className={styles.header}>
                <Link href="/dashboard">
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>S</span> SecureConnect
                    </div>
                </Link>
                <nav className={`flex items-center ${styles.nav}`}>
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="ml-9">
                                <AvatarImage />
                                <AvatarFallback className="text-black text-xs">User</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-5">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href="/settings/two-factor">
                                <DropdownMenuItem>Security</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <button onClick={handleLogout}>
                                    <span>Logout</span>
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </header>

            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-xl p-8 mt-9">
                <h1 className="text-xl tracking-tight mb-6" style={{ fontWeight: "600" }}>Two-Factor Authentication</h1>

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {!setupMode ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mt-1">
                                    {is2FAEnabled
                                        ? 'Your account is currently protected with two-factor authentication.'
                                        : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={is2FAEnabled ? "text-green-600" : "text-gray-500"}>
                                    {is2FAEnabled ? "Enabled" : "Disabled"}
                                </span>
                                <Switch
                                    checked={is2FAEnabled}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            initiateSetup();
                                        } else {
                                            disable2FA();
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium mb-2">Set up Two-Factor Authentication</h2>
                            <p className="text-gray-600 text-sm">
                                1. Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.).
                                <br />
                                2. Enter the 6-digit verification code provided by the app.
                            </p>
                        </div>

                        <div className="flex flex-col items-center p-6 border border-gray-100 rounded-lg bg-gray-50">
                            {qrCodeUrl && (
                                <div className="mb-4">
                                    <Image
                                        src={qrCodeUrl}
                                        alt="QR code for two-factor authentication setup"
                                        width={200}
                                        height={200}
                                        priority
                                    />
                                </div>
                            )}

                            <div className="w-full max-w-xs">
                                <p className="text-xs text-gray-600 mb-2">
                                    If you can&#39;t scan the QR code, enter this code manually in your app:
                                </p>
                                <div className="bg-white p-3 rounded border border-gray-200 text-center mb-4 font-mono text-sm break-all select-all">
                                    {secret}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={completeSetup} className="space-y-4">
                            <div>
                                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Verification Code
                                </label>
                                <Input
                                    id="verificationCode"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSetupMode(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={verificationCode.length !== 6 || isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify and Enable'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
