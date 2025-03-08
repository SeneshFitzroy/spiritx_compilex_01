import Link from 'next/link';
import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white tracking-tight">

      <Navbar/>

      <div className="py-40">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-2xl lg:text-4xl tracking-tight text-gray-900 mb-6">
            Your Gateway to a <span className="text-green-600 font-semibold">Safe Login System</span>
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            SecureConnect provides a rock-solid authentication system with proper validation,
            error handling, and user-friendly feedback.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <span className="px-6 py-3 bg-black text-white font-medium rounded-full">
                Sign Up
              </span>
            </Link>
            <Link href="/signiin">
              <span className="px-6 py-3 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 rounded-full">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Standard encryption and password hashing for maximum security.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">User Validation</h3>
              <p className="text-gray-600">
                Comprehensive validation ensures strong passwords and unique usernames.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">User-Friendly</h3>
              <p className="text-gray-600">
                Clear feedback and modern design for a seamless experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">So, how this works?</h2>
          <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-4">
            <div className="border border-black/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account with a unique username and strong password.
              </p>
            </div>
            <div className="border border-black/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Log In</h3>
              <p className="text-gray-600">
                Access your account securely with your credentials.
              </p>
            </div>
            <div className="border border-black/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Personalized Access</h3>
              <p className="text-gray-600">
                Enjoy a personalized welcome experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-5 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-600">©2025 SecureConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}