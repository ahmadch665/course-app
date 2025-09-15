"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { PlayCircle } from "lucide-react";
import axios from "axios";
import Image from "next/image";

export default function FeaturedCourses() {
  const controls = useAnimation();
  const carouselRef = useRef(null);

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://course-app-tvgx.onrender.com/api/course/allcourses"
        );
        // Ensure we have an array
        const coursesArray = Array.isArray(res.data) ? res.data : [];
        setFeaturedCourses(coursesArray);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setFeaturedCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();

    // Carousel animation
    controls.start({
      x: ["0%", "-100%"],
      transition: { repeat: Infinity, duration: 20, ease: "linear" },
    });
  }, [controls]);

  return (
    <motion.section className="py-20 px-6 md:px-12 overflow-hidden bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
        Featured Courses
      </h2>

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
        {loadingCourses ? (
          <p className="text-gray-500 text-center w-full">Loading courses...</p>
        ) : featuredCourses.length > 0 ? (
          [...featuredCourses, ...featuredCourses].map((course, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="min-w-[300px] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition flex flex-col"
            >
              <Image
<<<<<<< HEAD
                src={course.img || "/images/default-course.jpg"}
=======
                src={course.image || "/images/default-course.jpg"}
>>>>>>> a81e64b159c1667504e33f03fee1e10c1c229c0d
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-blue-700">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2 flex-1 overflow-hidden">
                  {course.desc || course.description || "No description available."}
                </p>
                {course.duration && (
                  <p className="text-gray-500 mt-2 text-sm">
                    Duration: {course.duration}
                  </p>
                )}
                <button className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <PlayCircle size={18} /> Start Learning
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No courses found.</p>
        )}
      </motion.div>
    </motion.section>
  );
}
