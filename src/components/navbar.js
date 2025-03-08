import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="rounded-full w-[50vw] m-auto">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <span className="text-xl font-semibold text-indigo-600">SecureConnect</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <span className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Log In</span>
                        </Link>
                        <Link href="/signup">
                            <span className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign Up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}