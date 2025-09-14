"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks ${form.name}, we’ll get back to you soon!`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white py-20 px-8">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">
        Contact Us
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Your Message"
          className="w-full mb-4 p-3 border rounded-lg"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        ></textarea>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Send Message
        </button>
      </form>
    </div>
  );
}
