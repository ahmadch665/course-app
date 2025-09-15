"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

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
    }
  };

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
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>

        {/* Desktop Search + Login */}
        <div className="hidden md:flex items-center gap-4">
          {/* 🔍 Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full border border-gray-300 px-4 py-1 w-64"
          >
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </form>

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
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

            {/* 🔍 Mobile Search with smooth animation */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 rounded-full border border-gray-300 px-4 py-2"
            >
              <Search className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none flex-1 text-sm"
              />
              {/* <button type="submit" className="text-blue-600 font-semibold ml-2">
                Go
              </button> */}
            </form>

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
