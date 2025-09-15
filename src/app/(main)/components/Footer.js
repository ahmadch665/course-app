import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-8 ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-2">LearnHub</h3>
          <p className="text-sm text-gray-200">
            LearnHub is an online learning platform offering top courses in web
            development, design, and business.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/courses" className="hover:underline">Courses</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <ul className="flex gap-4">
            <li><Link href="#" className="hover:underline">Facebook</Link></li>
            <li><Link href="#" className="hover:underline">Twitter</Link></li>
            <li><Link href="#" className="hover:underline">LinkedIn</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-gray-300 mt-6">
        © {new Date().getFullYear()} LearnHub. All rights reserved.
      </div>
    </footer>
  );
}
