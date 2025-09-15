"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const controls = useAnimation();
  const carouselRef = useRef(null);

  const blogs = [
    {
      title: "Top 10 React Tips",
      desc: "Boost your skills with these pro React techniques.",
      img: "/images/blog1.jpg",
    },
    {
      title: "Why Learn Next.js?",
      desc: "Discover the power of server-side rendering & SEO.",
      img: "/images/blog2.jpg",
    },
    {
      title: "UI/UX Trends 2025",
      desc: "Stay ahead with modern design inspirations.",
      img: "/images/blog3.jpg",
    },
  ];

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://course-app-tvgx.onrender.com/api/course/allcourses"
        );

        if (Array.isArray(res.data)) {
          setFeaturedCourses(res.data);
        } else if (Array.isArray(res.data.data)) {
          setFeaturedCourses(res.data.data);
        } else {
          console.error("Unexpected API response:", res.data);
          setFeaturedCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setFeaturedCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();

    controls.start({
      x: ["0%", "-100%"],
      transition: { repeat: Infinity, duration: 20, ease: "linear" },
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      {/* 🔄 Loader Overlay */}
      {/* {loadingCourses && (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )} */}

      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-6 md:px-12 text-center overflow-visible">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.svg')] bg-cover"></div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
      </section>

      {/* 📚 Featured Courses Carousel */}
      <motion.section className="py-20 px-6 md:px-12 overflow-hidden bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Featured Courses
        </h2>

        {loadingCourses ? (
          // 🎡 Loader only inside Featured Courses
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : featuredCourses.length > 0 ? (
          <motion.div
            ref={carouselRef}
            className="flex gap-8 cursor-grab"
            animate={controls}
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() =>
              controls.start({
                x: ["0%", "-100%"],
                transition: { repeat: Infinity, duration: 20, ease: "linear" },
              })
            }
            drag="x"
            dragConstraints={carouselRef}
            dragElastic={0.05}
          >
            {[...featuredCourses, ...featuredCourses].map((course, idx) => (
              <Link
                href={`/courses/${course._id}`}
                key={idx}
                className="min-w-[300px] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition flex flex-col"
              >
                <Image
                  src={course.img || "/pyhton.jpg"} // Ensure /l.webp is in public folder
                  alt={course.title || "Course Image"}
                  width={400} // exact width
                  height={192} // exact height (adjust as needed)
                  className="object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-blue-700">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mt-2 flex-1 overflow-hidden">
                    {course.desc ||
                      course.description ||
                      "No description available."}
                  </p>
                  {course.duration && (
                    <p className="text-gray-500 mt-2 text-sm">
                      Duration: {course.duration}
                    </p>
                  )}
                  <button className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer">
                    <PlayCircle size={18} /> Start Learning
                  </button>
                </div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-500 text-center w-full">No courses found.</p>
        )}
      </motion.section>
      {/* 📰 Blogs Section */}
      <motion.section
        className="py-20 px-6 md:px-12 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Latest from Our Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.03 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl bg-gradient-to-br from-white to-gray-50"
            >
              <Image
                src={blog.Image || "/images/default.jpg"} // fallback if blog.Image is undefined
                alt={blog.title || "Blog Image"}
                width={400}
                height={224}
                className=" object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mt-2">{blog.desc}</p>
                <button className="mt-4 text-blue-600 font-semibold hover:underline">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 💬 Testimonials */}
      <motion.section
        className="py-20 px-6 md:px-12 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
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
              feedback: "The design lessons are world-class. Highly recommend!",
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition"
            >
              <p className="italic text-gray-600">“{testi.feedback}”</p>
              <h4 className="mt-4 font-bold text-blue-700">{testi.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
