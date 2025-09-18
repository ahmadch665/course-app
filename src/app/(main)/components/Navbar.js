"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUpClick = () => router.push("/login");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setSuggestions([]); // ✅ dropdown band ho jaye
    }
  };

  // ✅ Fetch suggestions jab user type kare
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `https://course-app-tvgx.onrender.com/api/course/allcourses`
        );

        let courses = [];
        if (Array.isArray(res.data)) {
          courses = res.data;
        } else if (Array.isArray(res.data.data)) {
          courses = res.data.data;
        }

        // ✅ Search text kahin bhi match ho (not just first letter)
        const filtered = courses.filter((c) =>
          c.title?.toLowerCase().includes(search.toLowerCase())
        );

        // ✅ Sirf pehle 5 dikhaye
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce 300ms
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white shadow-lg" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          LearnHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/courses" className="hover:text-blue-600 transition">
            Courses
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </div>

        {/* Desktop Search + Login */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* 🔍 Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full border border-gray-300 
             px-4 py-1 w-64 focus-within:border-blue-500 transition-colors duration-300 relative"
          >
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </form>

          {/* ✅ Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-12 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {suggestions.map((course) => (
                <li
                  key={course._id}
                  onClick={() => {
                    router.push(`/courses/${course._id}`);
                    setSuggestions([]);
                    setSearch("");
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {course.title}
                </li>
              ))}
            </ul>
          )}

          {/* Login Button */}
          <button
            onClick={handleSignUpClick}
            className="px-3 py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 overflow-hidden"
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/courses" onClick={() => setMenuOpen(false)}>
              Courses
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            {/* 🔍 Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 rounded-full border border-gray-300 px-4 py-2 relative"
            >
              <Search className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </form>

            {/* ✅ Mobile Suggestions */}
            {suggestions.length > 0 && (
              <ul className="bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                {suggestions.map((course) => (
                  <li
                    key={course._id}
                    onClick={() => {
                      router.push(`/courses/${course._id}`);
                      setSuggestions([]);
                      setSearch("");
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {course.title}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                handleSignUpClick();
                setMenuOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
