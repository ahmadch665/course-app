"use client";

import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { PlayCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        const res = await api.get("/course/allcourses");
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
      {/* <div className="flex justify-center mb-10">
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
      </div> */}

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
              className="group bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl 
             transition duration-300 flex flex-col cursor-pointer overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={course.image || "/k.png"}
                  alt={course.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title + Duration inline */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition">
                    {course.title}
                  </h3>
                  {course.duration && (
                    <span
                      className="ml-2 min-w-[60px] h-6 flex items-center justify-center 
               text-xs font-medium text-blue-600 bg-blue-50 
               rounded text-center"
                    >
                      {course.duration}
                    </span>
                  )}
                </div>

                {/* Description bilkul title ke neeche */}
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {course.description || "No description available."}
                </p>

                {/* Button neeche gap ke saath */}
                <div className="mt-auto pt-4">
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 
                   text-white text-sm py-2.5 rounded-lg font-medium hover:bg-blue-700 
                   transition-all duration-300 cursor-pointer"
                  >
                    Course Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
