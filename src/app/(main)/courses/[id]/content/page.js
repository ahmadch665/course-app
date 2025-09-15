"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseContentPage() {
  const { id } = useParams();

  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    const dummyData = {
      title: "Python for Beginners",
      youtubeId: "K5KVEU3aaeQ",
      modules: [
        {
          title: "Introduction",
          content: "Welcome to the course! This module introduces you to the basics of cybersecurity.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Basic computer knowledge", "Internet access"]
        },
        {
          title: "Module 1: Network Security",
          content: "Learn about firewalls, routers, and network protection techniques.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Introduction module completed"]
        },
        {
          title: "Module 1: Introduction to Cybersecurity",
          content: "Learn the basics of cybersecurity, common threats, and why security matters.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Basic computer knowledge", "Internet access"]
        },
        {
          title: "Module 2: Network Security",
          content: "Understand firewalls, routers, VPNs, and techniques to secure a network.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Module 1 completed"]
        },
        {
          title: "Module 3: Cryptography Fundamentals",
          content: "Explore encryption, decryption, hashing, and digital signatures.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Module 2 completed"]
        },
        {
          title: "Module 4: Malware and Threat Analysis",
          content: "Identify types of malware, phishing attacks, and methods of prevention.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Module 3 completed"]
        },
        {
          title: "Module 5: Security Best Practices",
          content: "Learn how to protect personal and organizational data with best practices.",
          youtubeId: "K5KVEU3aaeQ",
          requirements: ["Module 4 completed"]
        }
      ]
    };

    setTimeout(() => {
      setCourseContent(dummyData);
      setLoading(false);
    }, 1000); // simulate 1s loading
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!courseContent)
    return <p className="text-center mt-20">Content not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {courseContent.title || "Course Title"}
        </h1>

        {/* Layout: Sidebar (sections) + Video */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar: Course Sections */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md min-h-[400px]">
            {courseContent.modules?.map((module, idx) => (
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

                {/* Smooth dropdown for details */}
                <AnimatePresence initial={false}>
                  {expandedModule === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50">
                        <p className="mb-2">
                          <strong>Course Content:</strong>{" "}
                          {module.content || "No content available."}
                        </p>
                        <ul className="list-disc pl-5">
                          {module.requirements && module.requirements.length > 0 ? (
                            module.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)
                          ) : (
                            <li>No requirements listed.</li>
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )) || <p className="p-4">No sections available.</p>}
          </div>

          {/* Video Panel */}
          <div className="flex-1">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${
                  expandedModule !== null
                    ? courseContent.modules[expandedModule]?.youtubeId
                    : courseContent.youtubeId || "K5KVEU3aaeQ"
                }`}
                title="YouTube video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
