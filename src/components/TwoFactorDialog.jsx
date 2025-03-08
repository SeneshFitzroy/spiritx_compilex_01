"use client"
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useRouter } from 'next/navigation'

export default function TwoFactorDialog({ isOpen, onClose, username }) {
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (otp.length === 6 && !isLoading) {
            handleVerify();
        }
    }, [otp]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch('/api/2fa/verify-2fa-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: otp }),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Verification failed');
                if (data.hint) {
                    setError(prev => `${prev}. ${data.hint}`);
                }
                setOtp("");
            } else {
                localStorage.setItem('username', data.user.username);
                router.push(data.redirect || '/dashboard');
            }
        } catch (err) {
            setError('An error occurred during verification. Please try again.');
            setOtp("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl mb-2">Two-Factor Authentication</DialogTitle>
                    <DialogDescription className="text-center">
                        Enter the 6-digit code from your authenticator app
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                    <div className="flex flex-col items-center space-y-4">
                        {username && (
                            <p className="text-blue-600 text-sm">Verifying for {username}</p>
                        )}

                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {isLoading && (
                            <p className="text-blue-600 text-sm animate-pulse">Verifying code...</p>
                        )}

                        <Button
                            className="w-full mt-4"
                            onClick={handleVerify}
                            disabled={otp.length !== 6 || isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
