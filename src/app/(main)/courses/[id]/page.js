"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../utils/axios";
import { PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${id}`);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p className="text-lg">Course not found.</p>
        <button
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                     text-white text-sm font-medium rounded-xl shadow-md 
                     hover:shadow-lg hover:scale-105 transition"
          onClick={() => router.push("/")}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-6 md:px-12 py-12">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden mb-16"
      >
        {/* Left */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-between">
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              {course.title}
            </h1>
            <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
            {course.duration && (
              <div className="bg-gray-50 rounded-2xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg text-gray-900 block">
                  {course.duration}
                </span>
                <p className="text-sm text-gray-500 mt-1">Duration</p>
              </div>
            )}
            {course.level && (
              <div className="bg-gray-50 rounded-2xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg text-gray-900 block">
                  {course.level}
                </span>
                <p className="text-sm text-gray-500 mt-1">Level</p>
              </div>
            )}
            {/* {course.price && (
              <div className="bg-gray-50 rounded-2xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg text-gray-900 block">
                  ${course.price}
                </span>
                <p className="text-sm text-gray-500 mt-1">Price</p>
              </div>
            )} */}
            {course.instructor && (
              <div className="bg-gray-50 rounded-2xl py-4 shadow-sm hover:shadow-md transition">
                <span className="font-semibold text-lg text-gray-900 block">
                  {course.instructor.userName || "Unknown"}
                </span>
                <p className="text-sm text-gray-500 mt-1">Instructor</p>
              </div>
            )}
          </div>

          {/* Action Button */}
         <div className="flex items-center gap-4 self-start mt-2">
  <button
    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
               text-white font-medium text-sm rounded-xl shadow-md 
               hover:shadow-lg hover:scale-105 transition flex items-center gap-2 cursor-pointer"
    onClick={() => router.push(`/courses/${id}/content`)}
  >
    <PlayCircle size={18} /> Get Started
  </button>

  {course.price && (
    <span className="text-xl font-semibold text-gray-900">
      ${course.price}
    </span>
  )}
</div>
</div>

        {/* Right Image */}
        <div className="flex-1 relative flex items-center justify-center">
          <Image
            src={course.image || "/l.webp"}
            alt={course.title || "Course image"}
            width={520}
            height={200}
            className="object-cover w-96 h-72 md:w-[28rem] md:h-80 rounded-3xl shadow-md"
          />
        </div>
      </motion.div>

      {/* What you'll learn */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10">
          What you&apos;ll learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {course.notes && course.notes.length > 0 ? (
            course.notes.slice(0, 3).map((note, idx) => (
              <div
                key={idx}
                className="relative bg-white shadow-md rounded-2xl p-6 border border-gray-200 flex flex-col hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {note.split(".")[0]}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{note}</p>
                <span className="absolute bottom-4 right-6 text-6xl font-extrabold text-gray-200/70 select-none">
                  {idx + 1}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes available.</p>
          )}
        </div>

        {/* Skills */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-16 mb-8">
          Learn the skills that matter most
        </h2>
        <div className="flex flex-wrap gap-4">
          {course.notes &&
            course.notes.length > 3 &&
            course.notes.slice(3).map((note, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition"
              >
                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg text-xs">
                  {"</>"}
                </span>
                <h4 className="font-medium text-gray-800 text-sm">
                  {note.split(".")[0]}
                </h4>
              </div>
            ))}
        </div>

        {/* Course Content */}
        <div className="mt-14 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Course Content
          </h2>
          <button
            onClick={() => setShowContent((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                       text-sm font-medium shadow-md hover:shadow-lg 
                       hover:scale-105 transition"
          >
            {showContent ? "Hide" : "Show"}
            <motion.span
              initial={false}
              animate={{ rotate: showContent ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showContent ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </motion.span>
          </button>
        </div>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              {course.courseContent ? (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {course.courseContent}
                </p>
              ) : (
                <p className="text-gray-500">No course content available.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
