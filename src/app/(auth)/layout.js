export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
      {/* no Navbar or Footer */}
    </div>
  );
}
