"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../utils/axios";
import { ChevronDown, ChevronUp, CheckCircle, Circle } from "lucide-react";

export default function CourseContentPage() {
  const { id } = useParams();

  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [isShrunk, setIsShrunk] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);

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
    if (!url) return null;
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
        const res = await api.get(`/course/${id}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!courseContent)
    return <p className="text-center mt-20">Content not found.</p>;

  const currentVideoUrl =
  currentVideoIndex !== null
    ? courseContent.videoDescription[currentVideoIndex]?.videoUrl
    : courseContent.videoUrls?.[0] ||
      "https://www.youtube.com/embed/K5KVEU3aaeQ";


  const toggleCompletion = (idx) => {
    setCompletedModules((prev) =>
      prev.map((done, i) => (i === idx ? !done : done))
    );
  };

const Sidebar = () => (
  <div className="bg-white border-r lg:w-80 flex flex-col shadow-lg">
    {/* Header */}
    <h2 className="text-lg font-semibold px-5 py-4 border-b text-gray-900 bg-white">
      Course Modules
    </h2>

    {/* Module List */}
    <div className="overflow-y-auto flex-1 p-4 space-y-2">
      {courseContent.videoDescription &&
      courseContent.videoDescription.length > 0 ? (
        courseContent.videoDescription.map((module, idx) => (
          <div
            key={idx}
            className={`rounded-lg border border-gray-200 bg-white shadow-sm 
                        hover:shadow-md transition-all duration-200`}
          >
            {/* Toggle Button */}
            <button
  onClick={() => {
    setExpandedModule(expandedModule === idx ? null : idx);
    setCurrentVideoIndex(idx); // module click se video change
  }}
  className={`w-full text-left px-4 py-3 flex justify-between items-center 
              text-sm font-medium transition rounded-lg ${
    expandedModule === idx
      ? "bg-blue-50 text-blue-700"
      : "hover:bg-gray-50"
  }`}
            >
              <div className="flex items-center gap-3">
                {/* Completion Icon */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompletion(idx);
                  }}
                  className="cursor-pointer flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white shadow-sm"
                >
                  {completedModules[idx] ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                </span>

                {/* Title */}
                <span className="truncate font-medium text-gray-800">
                  {module.sectionName || `Section ${idx + 1}`}
                </span>
              </div>

              {/* Chevron */}
              {expandedModule === idx ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {expandedModule === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-3 bg-gray-50 text-sm text-gray-700 space-y-2 border-t">
                    {module.content && module.content.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
                        {module.content.map((item, i) => (
                          <li key={i} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">
                        No content available
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      ) : (
        <p className="p-4 text-sm text-gray-500">No modules available.</p>
      )}
    </div>
  </div>
);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <motion.div
          className="bg-white w-full shadow-lg  overflow-hidden 
             h-[25vh] sm:h-[35vh] md:h-auto"
          animate={
            typeof window !== "undefined" && window.innerWidth >= 768
              ? { height: isShrunk ? "40vh" : "70vh" }
              : {}
          }
          transition={{ duration: 0.4 }}
        >
          <div className="w-full h-full px-4 py-3">
            <iframe
              className="w-full h-full rounded-t-xl rounded-b-xl shadow-md"
              src={getEmbedUrl(currentVideoUrl)}
              title="Course Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
        <div
          ref={descRef}
          onScroll={(e) => {
            const scrollTop = e.currentTarget.scrollTop;
            setIsShrunk(scrollTop > 10);
          }}
          className="bg-white p-8 border-t border-gray-200 overflow-y-scroll h-[60vh] scrollbar-hide"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {courseContent.title || "Course Title"}
          </h1>

          <p className="text-gray-500 mb-6 text-sm">
            Instructor:{" "}
            <span className="font-medium text-gray-800">
              {courseContent.instructor?.userName || "Unknown"}
            </span>
          </p>

          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {courseContent.transcription || "No description available."}
          </p>
        </div>
      </main>
    </div>
  );
}