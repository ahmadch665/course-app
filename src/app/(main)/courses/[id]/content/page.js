"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function CourseContentPage() {
  const { id } = useParams();

  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  // ✅ Helper: convert any YouTube URL into embeddable format
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

  if (!courseContent)
    return <p className="text-center mt-20">Content not found.</p>;

  // Determine current video URL
  const currentVideoUrl =
    expandedModule !== null
      ? courseContent.videoDescription[expandedModule]?.videoUrl ||
        courseContent.videoUrls?.[0]
      : courseContent.videoUrls?.[0] ||
        "https://www.youtube.com/embed/K5KVEU3aaeQ";

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        {/* Course Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {courseContent.title || "Course Title"}
        </h1>

        {/* Layout: Sidebar + Video */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar: Modules */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md min-h-[400px]">
            {courseContent.videoDescription &&
            courseContent.videoDescription.length > 0 ? (
              courseContent.videoDescription.map((module, idx) => (
                <div key={idx} className="border-b last:border-none">
                  <button
                    onClick={() =>
                      setExpandedModule(expandedModule === idx ? null : idx)
                    }
                    className={`w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50 ${
                      expandedModule === idx ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <span>{module.title || `Section ${idx + 1}`}</span>
                    <span>{expandedModule === idx ? "▲" : "▼"}</span>
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
                        <div className="p-4 bg-gray-50 space-y-3">
                          {/* <p>
                            <strong>Course Content:</strong>{" "}
                            {courseContent.content ?? "No content available."}
                          </p> */}
                          <p>
                            {/* <strong>Video Description:</strong>{" "} */}
                            {courseContent.videoDescription ??
                              "No video description available."}
                          </p>
                          <ul className="list-disc pl-5">
                            {module.requirements &&
                            module.requirements.length > 0 ? (
                              module.requirements.map((req, rIdx) => (
                                <li key={rIdx}>{req}</li>
                              ))
                            ) : (
                              <li>No requirements listed.</li>
                            )}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <p className="p-4">No modules available.</p>
            )}
          </div>

          {/* Video Panel */}
          <div className="flex-1">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
              <iframe
                className="w-full h-full"
                src={getEmbedUrl(currentVideoUrl)}
                title="Course Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
