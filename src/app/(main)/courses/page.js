"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlayCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://course-app-tvgx.onrender.com/api/course/allcourses"
        );
        const coursesArray = res.data.courses || res.data.data || [];
        setCourses(coursesArray);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Courses Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <div
              key={course._id || course.id}
              onClick={() => router.push(`/courses/${course._id || course.id}`)}
              className="cursor-pointer bg-white shadow-xl rounded-2xl overflow-hidden border hover:shadow-2xl transition"
            >
              <img
                src={course.img || "/k.png"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-700">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm">{course.description}</p>
                <button className="mt-4 flex w-full items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  <PlayCircle size={18} /> Start Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  