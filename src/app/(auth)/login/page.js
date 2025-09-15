"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../../utils/axios"; 
import Link from "next/link";

const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        userName: username,
        password,
      });

      console.log("✅ Login Success:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      router.push("/admin-dashboard");
    } 
  catch (err) {
  if (err.response) {
    console.error("❌ Login Error Data:", err.response.data || "No data");
    console.error("❌ Login Error Status:", err.response.status);

    const message = err.response.data?.message || "Invalid username or password";
    setError(message);

  } else if (err.request) {
    console.error("❌ No response:", err.request);
    setError("No response from server. Try again later.");
  } else {
    console.error("❌ Error Message:", err.message);
    setError("Something went wrong. Try again.");
  }
} 
finally {
  setLoading(false);
}


  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transform scale-95 animate-fadeIn">
        
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-900 to-blue-700 relative">
          <div className="h-full flex flex-col justify-center items-center p-10 text-white">
            <Image
              src="/l.webp"
              alt="Course App Logo"
              width={128}
              height={128}
              className="mb-6"
            />
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
            <Image
              src="/l.webp"
              alt="Course App Logo"
              width={96}
              height={96}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-white">
              Login to Course App
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
                required
              />
              
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

         
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

export default Page;
