"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export default function LandingPage() {
  const router = useRouter(); // ✅ Initialize router

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.svg')] bg-cover"></div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative text-4xl md:text-6xl font-extrabold mb-6 z-10"
        >
          Learn Anything, Anytime with{" "}
          <span className="text-yellow-300 drop-shadow-lg">LearnHub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative text-lg md:text-xl max-w-2xl mx-auto mb-8 z-10"
        >
          Explore thousands of courses from top instructors and grow your skills
          in tech, business, design, and more.
        </motion.p>

        {/* ✅ Updated Explore Courses button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/courses")} // ✅ Navigate to courses page
          className="relative px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-300 transition z-10"
        >
          Explore Courses
        </motion.button>
      </section>

      {/* 📚 Featured Courses */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Popular Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: "React for Beginners",
              desc: "Build modern web apps with React.",
              img: "/images/react-course.jpg",
            },
            {
              title: "Next.js Mastery",
              desc: "Learn SSR, API routes & more.",
              img: "/images/next-course.jpg",
            },
            {
              title: "UI/UX Design Basics",
              desc: "Design engaging and user-friendly apps.",
              img: "/images/design-course.jpg",
            },
          ].map((course, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition"
            >
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-700">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2">{course.desc}</p>
                <button className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <PlayCircle size={18} /> Start Learning
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏷️ Categories */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { name: "Web Development", icon: <BookOpen size={32} /> },
            { name: "Design", icon: <Star size={32} /> },
            { name: "Business", icon: <Users size={32} /> },
            { name: "Data Science", icon: <BookOpen size={32} /> },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.08 }}
              className="p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-blue-600 flex justify-center mb-4">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section className="py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "Ali Khan",
              feedback:
                "LearnHub transformed my career! The React course was amazing.",
            },
            {
              name: "Sara Ahmed",
              feedback:
                "The design lessons are world-class. Highly recommend!",
            },
            {
              name: "John Doe",
              feedback:
                "I love the flexibility. I can learn at my own pace anytime.",
            },
          ].map((testi, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition"
            >
              <p className="italic text-gray-600">“{testi.feedback}”</p>
              <h4 className="mt-4 font-bold text-blue-700">{testi.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
