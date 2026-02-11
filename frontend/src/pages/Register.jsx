import React from "react";
import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex w-1/2 bg-[var(--accent-primary)] text-[var(--accent-text)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-2xl font-bold tracking-tight mb-2">NoteApp</div>
          <div className="h-1 w-12 bg-blue-500 rounded"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Build your second brain.</h1>
          <p className="text-lg opacity-80 leading-relaxed">
            "Capture ideas, organize notes, and collaborate in real time. Join thousands of productive teams today."
          </p>
        </div>

        <div className="relative z-10 text-sm opacity-60">
          &copy; {new Date().getFullYear()} NoteApp Inc.
        </div>

        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-app)]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Create your account</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link className="text-blue-600 font-semibold hover:text-blue-500 transition-colors" to="/login">
                Sign in
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-[var(--border-color)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                <input
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-[var(--text-tertiary)]"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-[var(--text-tertiary)]"
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-[var(--text-tertiary)]"
                  onChange={handleChange}
                />
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
