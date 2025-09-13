'use client';

import React from 'react';
import Link from 'next/link';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transform transition duration-500 scale-95 animate-fadeIn">

        {/* Left side: Branding (desktop only) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-900 to-blue-700 relative">
          <div className="h-full flex flex-col justify-center items-center p-10 text-white">
            <img
              src="/l.webp"
              alt="Course App Logo"
              className="w-32 mb-6"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide text-center md:text-left">
              Join Qutham Course App
            </h2>
            <p className="text-white/90 text-center md:text-left leading-relaxed">
              Create your account to manage your courses, track progress, and excel in your learning journey.
            </p>
          </div>
        </div>

        {/* Right side: Signup Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          {/* Mobile Branding */}
          <div className="flex md:hidden flex-col justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-700 w-full rounded-t-xl p-6 mb-6 text-white text-center">
            <img
              src="/l.webp"
              alt="Course App Logo"
              className="w-24 mb-4"
            />
            <h2 className="text-2xl font-bold">Sign Up to Course App</h2>
            <p className="text-white/90 leading-relaxed mt-2">
              Create your account to manage your courses, track progress, and excel in your learning journey.
            </p>
          </div>

          {/* Signup Form */}
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
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
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition duration-300 shadow-md"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>

        </div>

      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default page;
