"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronDown, ChevronUp, CheckCircle, Circle } from "lucide-react";

export default function CourseContentPage() {
  const { id } = useParams();

  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [isShrunk, setIsShrunk] = useState(false);

  const descRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!descRef.current) return;
      setIsShrunk(descRef.current.scrollTop > 0);
    };

    const el = descRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
      if (url.includes("youtube.com/embed")) return url;
      return url;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const res = await axios.get(
          `https://course-app-tvgx.onrender.com/api/course/${id}`
        );
        const data = res.data.data || res.data;
        setCourseContent(data);
        setCompletedModules(Array(data.videoDescription?.length).fill(false));
      } catch (err) {
        console.error("Error fetching course content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseContent();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!courseContent) return <p className="text-center mt-20">Content not found.</p>;

  const currentVideoUrl =
    expandedModule !== null
      ? courseContent.videoDescription[expandedModule]?.videoUrl ||
        courseContent.videoUrls?.[0]
      : courseContent.videoUrls?.[0] || "https://www.youtube.com/embed/K5KVEU3aaeQ";

  const toggleCompletion = (idx) => {
    setCompletedModules((prev) =>
      prev.map((done, i) => (i === idx ? !done : done))
    );
  };

  const progress =
    completedModules.length > 0
      ? Math.round(
          (completedModules.filter((x) => x).length / completedModules.length) * 100
        )
      : 0;

  const Sidebar = () => (
  <div className="bg-white border-b lg:border-r lg:border-b-0 lg:w-80 flex flex-col">
    <div className="overflow-y-auto flex-1">
      {courseContent.videoDescription && courseContent.videoDescription.length > 0 ? (
        courseContent.videoDescription.map((module, idx) => (
          <div key={idx} className="border-b last:border-none">
            <button
              onClick={() =>
                setExpandedModule(expandedModule === idx ? null : idx)
              }
              className={`w-full text-left px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-gray-50 transition ${
                expandedModule === idx ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // prevent expanding the section
                    toggleCompletion(idx);
                  }}
                >
                  {completedModules[idx] ? (
                    <motion.span
                      className="w-5 h-5 text-green-600 cursor-pointer"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      className="w-5 h-5 text-gray-400 cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Circle className="w-5 h-5" />
                    </motion.span>
                  )}
                </span>
                <span>{module.sectionName || `Section ${idx + 1}`}</span>
              </div>
              {expandedModule === idx ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {expandedModule === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-3 bg-gray-50 text-sm text-gray-700 space-y-3">
                    {module.content && module.content.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {module.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No content available</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      ) : (
        <p className="p-4 text-sm">No modules available.</p>
      )}
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <motion.div
          className="bg-black w-full"
          animate={{ height: isShrunk ? "40vh" : "70vh" }}
          transition={{ duration: 0.4 }}
        >
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(currentVideoUrl)}
            title="Course Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        <div
          ref={descRef}
          onScroll={(e) => {
            const scrollTop = e.currentTarget.scrollTop;
            setIsShrunk(scrollTop > 10);
          }}
          className="bg-white p-6 border-t border-gray-200 overflow-y-scroll h-[60vh] scrollbar-hide"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {courseContent.title || "Course Title"}
          </h1>

          <p className="text-gray-600 mb-4">
            instructor: {courseContent.instructor?.userName || "Course description goes here."}
          </p>

          <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">
            {courseContent.transcription || "Unknown"}
          </p>

          <div className="h-32"></div>
        </div>
      </main>
    </div>
  );
}
