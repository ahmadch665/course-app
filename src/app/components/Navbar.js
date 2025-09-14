"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUpClick = () => router.push("/login");

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
        <div className="hidden md:flex gap-8">
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

        {/* Desktop Sign Up */}
        <div className="hidden md:flex">
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
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/courses" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            Courses
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <button
            onClick={() => {
              handleSignUpClick();
              setMenuOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
