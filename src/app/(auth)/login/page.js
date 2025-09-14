"use client";

import React from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault(); 
    router.push("/dashboard"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transform scale-95 animate-fadeIn">
   
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-900 to-blue-700 relative">
          <div className="h-full flex flex-col justify-center items-center p-10 text-white">
            <img src="/l.webp" alt="Course App Logo" className="w-32 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide text-center md:text-left">
              Welcome to Qutham Course App
            </h2>
            <p className="text-white/100 text-center md:text-left leading-relaxed">
              Your Path to Career-Ready Skills.
            </p>
          </div>
        </div>

       
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        
          <div className="mb-6 text-center md:hidden bg-gradient-to-tr from-blue-900 to-blue-700 p-6 rounded-xl">
            <img
              src="/l.webp"
              alt="Course App Logo"
              className="w-24 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-white">
              Login to Course App
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
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
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                required
              />
              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition duration-300 shadow-md"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

     
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default page;
