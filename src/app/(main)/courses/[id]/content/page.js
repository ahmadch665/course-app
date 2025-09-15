"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Divide } from "lucide-react";

export default function CourseContentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          `https://course-app-tvgx.onrender.com/api/course/${id}`
        );
        setCourseContent(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching course content:", err);
        setCourseContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) return <p>Loading content...</p>;
  if (!courseContent) return <p>Content not found.</p>;

  return (
    <div>CoursesPage</div>
  );
}
