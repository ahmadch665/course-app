"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
      setSuggestions([]);
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/course/allcourses`);
        let courses = Array.isArray(res.data) ? res.data : res.data.data || [];
        const filtered = courses.filter((c) =>
          c.title?.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-md ${
        scrolled
          ? "bg-white/90 shadow-md"
          : "bg-white/60 border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 tracking-wide">
            LearnHub
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-normal">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Desktop Search + Login */}
        <div className="hidden md:flex items-center gap-4 relative">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full border border-gray-300 
             px-4 py-1 w-64 focus-within:border-blue-500 shadow-sm transition"
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

          {/* Suggestions */}
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
            className="px-5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
             font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 
             shadow-md transition cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Mobile Icons */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
            <Search size={22} className="text-gray-700" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 py-3"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 rounded-full border border-gray-300 
               px-4 py-2 w-full focus-within:border-blue-500 shadow-sm"
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

            {/* Mobile Suggestions */}
            {suggestions.length > 0 && (
              <ul className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                {suggestions.map((course) => (
                  <li
                    key={course._id}
                    onClick={() => {
                      router.push(`/courses/${course._id}`);
                      setSuggestions([]);
                      setSearch("");
                      setMobileSearchOpen(false);
                      setMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {course.title}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md px-6 py-5 flex flex-col gap-4 font-medium"
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

            <button
              onClick={() => {
                handleSignUpClick();
                setMenuOpen(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
               text-white rounded-full font-medium hover:from-blue-700 
               hover:to-blue-800 shadow-md transition"
            >
              Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
