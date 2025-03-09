'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const username = localStorage.getItem('username');
        setIsLoggedIn(!!username);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        router.push('/signin');
    };

    return (
        <main className="flex justify-center pt-5 tracking-tight">
            <nav className="fixed rounded-full w-[90vw] lg:w-[50vw] m-auto bg-white/50 backdrop-blur-md border border-black/10" style={{zIndex: "2"}}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/">
                                <span className="text-xl font-semibold">SecureConnect</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            {!isLoggedIn ? (
                                <>
                                    <Link href="/signin">
                                        <span className="px-3 py-2 text-sm font-medium text-black hover:underline">Log In</span>
                                    </Link>
                                    <Link href="/signup">
                                        <span className="px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-black">Sign Up</span>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center" style={{ gap: "9px" }} >
                                    <Link href="/dashboard">
                                        <Button className="rounded-full">Dashboard</Button>
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant={"destructive"}
                                        className="rounded-full"
                                    >
                                        Logout
                                    </ Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </main >
    );
}