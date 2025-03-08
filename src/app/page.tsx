import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      <div className="flex justify-center">
        <nav className="fixed w-full z-40 top-0">
          <div className="rounded-full w-[50vw] m-auto mt-4 bg-white/70 backdrop-blur-md shadow-sm px-6">
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
      </div>

      <div className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Your Gateway to a <span className="text-indigo-600">Safe Login System</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            SecureConnect provides a rock-solid authentication system with proper validation,
            error handling, and user-friendly feedback.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700">
                Get Started
              </span>
            </Link>
            <Link href="/login">
              <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Industry-standard encryption and password hashing for maximum security.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">User Validation</h3>
              <p className="text-gray-600">
                Comprehensive validation ensures strong passwords and unique usernames.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">User-Friendly</h3>
              <p className="text-gray-600">
                Clear feedback and intuitive design for a seamless experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-4">
            <div className="border rounded-lg p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account with a unique username and strong password.
              </p>
            </div>
            <div className="border rounded-lg p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Log In</h3>
              <p className="text-gray-600">
                Access your account securely with your credentials.
              </p>
            </div>
            <div className="border rounded-lg p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Personalized Access</h3>
              <p className="text-gray-600">
                Enjoy a personalized welcome and access to all platform features.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-8 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} SecureConnect. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/"><span className="text-gray-500 hover:text-gray-700">Home</span></Link>
            <Link href="/login"><span className="text-gray-500 hover:text-gray-700">Login</span></Link>
            <Link href="/signup"><span className="text-gray-500 hover:text-gray-700">Sign Up</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}