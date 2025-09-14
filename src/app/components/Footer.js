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
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/courses" className="hover:underline">Courses</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <ul className="flex gap-4">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-gray-300 mt-6">
        © {new Date().getFullYear()} LearnHub. All rights reserved.
      </div>
    </footer>
  );
}
