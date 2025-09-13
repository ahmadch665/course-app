'use client';

import React from "react";
import { useRouter } from "next/navigation";



const page = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Redirect to login page
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          <p>View all your enrolled courses and progress here.</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Upcoming Classes</h2>
          <p>Check your schedule and upcoming classes.</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p>Update your profile and account settings.</p>
        </div>
      </main>
    </div>
  );
};

export default page;
