"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const controls = useAnimation();
  const carouselRef = useRef(null);

  const blogs = [
    { title: "Top 10 React Tips", desc: "Boost your skills with these pro React techniques.", img: "/images/blog1.jpg" },
    { title: "Why Learn Next.js?", desc: "Discover the power of server-side rendering & SEO.", img: "/images/blog2.jpg" },
    { title: "UI/UX Trends 2025", desc: "Stay ahead with modern design inspirations.", img: "/images/blog3.jpg" },
  ];

  const featuredCourses = [
    { title: "React for Beginners", desc: "Build modern web apps with React.", img: "/images/react-course.jpg" },
    { title: "Next.js Mastery", desc: "Learn SSR, API routes & more.", img: "/images/next-course.jpg" },
    { title: "UI/UX Design Basics", desc: "Design engaging and user-friendly apps.", img: "/images/design-course.jpg" },
    { title: "Data Science 101", desc: "Explore data analysis and ML basics.", img: "/images/data-course.jpg" },
  ];

  useEffect(() => {
    controls.start({
      x: ["0%", "-100%"],
      transition: { repeat: Infinity, duration: 20, ease: "linear" },
    });
  }, [controls]);

  // Search bar state
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const categories = [
    "Web Development",
    "Python",
    "Next.js",
    "Graphic Designing",
    "WordPress",
    "Angular",
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query || selectedCategory) {
      router.push(
        `/courses?search=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory)}`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredCategories.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategories.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const selected = filteredCategories[highlightIndex];
      setSelectedCategory(selected);
      setQuery(selected);
      setShowDropdown(false);
      setHighlightIndex(-1);
      router.push(
        `/courses?search=${encodeURIComponent(selected)}&category=${encodeURIComponent(selected)}`
      );
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-6 md:px-12 text-center overflow-visible">
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
          Explore thousands of courses from top instructors and grow your skills in tech, business, design, and more.
        </motion.p>

        {/* Search Bar with Dropdown & Keyboard Support */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative max-w-2xl mx-auto z-10"
          onSubmit={handleSubmit}
        >
   <div className="flex relative w-80 mx-auto">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onFocus={() => setShowDropdown(true)}
    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
    onKeyDown={handleKeyDown}
    placeholder="Search for a course..."
    className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none text-gray-800 bg-white"
  />
  <button
    type="submit"
    className="px-3 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-r-lg hover:bg-yellow-300 transition"
  >
    Search
  </button>

            <AnimatePresence>
              {showDropdown && filteredCategories.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-20 text-gray-800"
                >
                  {filteredCategories.map((cat, index) => (
                    <li
                      key={cat}
                      onMouseDown={() => {
                        setSelectedCategory(cat);
                        setQuery(cat);
                        setShowDropdown(false);
                        setHighlightIndex(-1);
                      }}
                      className={`px-4 py-2 cursor-pointer ${
                        highlightIndex === index
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </section>

      {/* 📚 Featured Courses Carousel */}
      <motion.section className="py-20 px-6 md:px-12 overflow-hidden bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">Featured Courses</h2>
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
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="min-w-[300px] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition">
              <img src={course.img} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-700">{course.title}</h3>
                <p className="text-gray-600 mt-2">{course.desc}</p>
                <button className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <PlayCircle size={18} /> Start Learning
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 📰 Blogs Section */}
      <motion.section className="py-20 px-6 md:px-12 bg-white" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, idx) => (
            <motion.div key={idx} whileHover={{ y: -10, scale: 1.03 }} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: idx * 0.2 }} viewport={{ once: true }} className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <img src={blog.img} alt={blog.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">{blog.title}</h3>
                <p className="text-gray-600 mt-2">{blog.desc}</p>
                <button className="mt-4 text-blue-600 font-semibold hover:underline">Read More →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 💬 Testimonials */}
      <motion.section className="py-20 px-6 md:px-12 bg-gray-50" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: "Ali Khan", feedback: "LearnHub transformed my career! The React course was amazing." },
            { name: "Sara Ahmed", feedback: "The design lessons are world-class. Highly recommend!" },
            { name: "John Doe", feedback: "I love the flexibility. I can learn at my own pace anytime." },
          ].map((testi, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.2 }} viewport={{ once: true }} className="p-6 bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition">
              <p className="italic text-gray-600">“{testi.feedback}”</p>
              <h4 className="mt-4 font-bold text-blue-700">{testi.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
