import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#212529] tracking-tight">

      <Navbar/>

      <div className="flex items-center pt-40">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-2xl lg:text-5xl tracking-tight text-[#DEE2E6] mb-6">
            Your Modern Gateway to a <br/> <span className="text-green-600 font-semibold">Safe Login System</span>
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            SecureConnect provides a rock-solid authentication system with proper validation,
            error handling, and user-friendly feedback.
          </p>
        </div>
      </div>

      <div className="bg-[#212529] pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-white mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#343A40] p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Secure Authentication Implementation</h3>
              <p className="text-gray-300">
                Industry-level encryption and password hashing for maximum security.
              </p>
            </div>
            <div className="bg-[#343A40] p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">User Input Validation</h3>
              <p className="text-gray-300">
                Comprehensive validation ensures strong passwords and unique usernames.
              </p>
            </div>
            <div className="bg-[#343A40] p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">User-Friendly Design</h3>
              <p className="text-gray-300">
                Clear feedback and modern design for a seamless experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-white mb-12">So, how this works?</h2>
          <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-4">
            <div className="border border-white/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2 text-white">Sign Up</h3>
              <p className="text-gray-300">
                Create your account with a unique username and strong password.
              </p>
            </div>
            <div className="border border-white/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="font-medium mb- text-white">Log In</h3>
              <p className="text-gray-300">
                Access your account securely with your credentials.
              </p>
            </div>
            <div className="border border-white/20 rounded-xl p-6 md:w-1/3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <span className="font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2 text-white">Personalized Access</h3>
              <p className="text-gray-300">
                Enjoy a personalized welcome experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-5 border-t border-white/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-300">©2025 SecureConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}