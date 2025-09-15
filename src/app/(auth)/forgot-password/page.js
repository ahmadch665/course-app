"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  const router = useRouter();

  const handleReset = (e) => {
    e.preventDefault();
    // Here you can add logic to send reset email
    alert("Password reset link sent to your email!");
    router.push("/login"); // redirect to login after reset
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-xl w-full max-w-md p-8 md:p-12 transform scale-95 animate-fadeIn">
        <div className="mb-6 text-center">
          <Image
            src="/l.webp"
            alt="Course App Logo"
            width={96}   // ✅ added
            height={96}  // ✅ added
            className="w-24 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot Password
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleReset}>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition duration-300 shadow-md"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
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

export default ForgotPassword;
