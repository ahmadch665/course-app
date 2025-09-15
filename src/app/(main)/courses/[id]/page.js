"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const { id } = useParams(); 
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `https://course-app-tvgx.onrender.com/api/course/${id}`
      );
      setCourse(res.data.data || res.data); 
    } catch (err) {
      console.error("Error fetching course:", err);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  fetchCourse();
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>Course not found.</p>
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          onClick={() => router.push("/")}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 md:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl w-full bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Content */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {course.title}
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-8 whitespace-pre-line">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6 text-center text-gray-700">
            {course.duration && (
              <div>
                <span className="font-bold">{course.duration}</span>
                <p className="text-sm">Duration</p>
              </div>
            )}
            {course.level && (
              <div>
                <span className="font-bold">{course.level}</span>
                <p className="text-sm">Level</p>
              </div>
            )}
            {course.price && (
              <div>
                <span className="font-bold">${course.price}</span>
                <p className="text-sm">Price</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-6 mb-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <PlayCircle size={20} /> Get started
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative bg-gradient-to-tr from-orange-200 to-orange-300 flex items-center justify-center">
          <img
            src={course.img || "/l.webp"}
            alt={course.title}
            className="w-full h-full object-cover rounded-l-none md:rounded-l-3xl md:rounded-r-3xl"
          />
        </div>
      </motion.div>
    </div>
  );
}
