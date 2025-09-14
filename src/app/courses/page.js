"use client";

import React, { useState } from "react";
import { Search, PlayCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    category: "Web Development",
    desc: "Build dynamic React apps.",
    img: "/images/react-course.jpg",
  },
  {
    id: 2,
    title: "Next.js Mastery",
    category: "Web Development",
    desc: "SSR, API routes, and more.",
    img: "/images/next-course.jpg",
  },
  {
    id: 3,
    title: "UI/UX Design",
    category: "Design",
    desc: "Design engaging user interfaces.",
    img: "/images/design-course.jpg",
  },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-16 px-8">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-12">
        Explore Courses
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-xl rounded-2xl overflow-hidden border hover:shadow-2xl transition"
          >
            <img
              src={course.img}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-700">
                {course.title}
              </h3>
              <p className="text-gray-500 text-sm">{course.desc}</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                <PlayCircle size={18} /> Start Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
