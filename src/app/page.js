import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        
        {/* Left side: Image or branding */}
        <div className="hidden md:block md:w-1/2 bg-blue-900">
          <div className="h-full flex flex-col justify-center items-center p-10 text-white">
            <img
              src="/logo.png"
              alt="Course App Logo"
              className="w-32 mb-6"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome to Qutham Course App</h2>
            <p className="text-white/90 text-center">
              Manage your courses, track your progress, and excel in your learning journey.
            </p>
          </div>
        </div>

        {/* Right side: Login form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-6 text-center md:hidden">
            <img
              src="public/logo.png"
              alt="Course App Logo"
              className="w-24 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">Login to Course App</h2>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
