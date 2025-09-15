"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { PlayCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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

  // 🔄 Loader overlay
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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

  const learnCards = [
    {
      title: "JavaScript, React, & Node.js",
      description: "Build fully-fledged websites and web apps.",
    },
    {
      title: "JavaScript Interviews",
      description: "Prepare for JavaScript Interviews.",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Prepare for the data structures and algorithm interviews.",
    },
  ];

  const skills = [
    { title: "Web Development", learners: "14M learners" },
    { title: "JavaScript", learners: "18M learners" },
    { title: "HTML", learners: "12M learners" },
    { title: "CSS", learners: "9.9M learners" },
    { title: "Node.Js", learners: "3.4M learners" },
  ];

  return (
    <div className="bg-gray-50 px-6 md:px-12 py-12">
      {/* Course Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden mb-16"
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
  <button
    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
    onClick={() => router.push(`/courses/${id}/content`)} // <-- navigation added
  >
    <PlayCircle size={20} /> Get started
  </button>
</div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative bg-gradient-to-tr from-orange-200 to-orange-300 flex items-center justify-center">
          <Image
            src={course.image || "/l.webp"}
            alt={course.title}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-l-none md:rounded-l-3xl md:rounded-r-3xl"
          />
        </div>
      </motion.div>

      {/* What youll learn Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
          What you&apos;ll learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {learnCards.map((card, idx) => (
            <div
              key={idx}
              className="relative bg-white shadow-md rounded-2xl p-6 border border-gray-200 overflow-hidden flex flex-col"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
              </div>

              {/* Button fixed at bottom */}
              <button className="flex items-center gap-2 text-blue-700 font-semibold hover:underline mt-auto cursor-pointer">
                Course content <ArrowRight size={18} />
              </button>

              {/* Big Number Background */}
              <span className="absolute bottom-4 right-6 text-7xl font-extrabold text-gray-200/70 select-none">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-16 mb-8">
          Learn the skills that matter most
        </h2>
        <div className="flex flex-wrap gap-4 cursor-pointer">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                {"</>"}
              </span>
              <div>
                <h4 className="font-semibold text-gray-800">{skill.title}</h4>
                <p className="text-sm text-gray-500">{skill.learners}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
