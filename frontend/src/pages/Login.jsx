import React from "react";
import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log(res.data);
      login(res.data);
      navigate("/dashboard");
      alert("Login successful");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
          <h1 className="text-5xl font-bold mb-6 leading-tight">Your notes. Shared, secure, and fast.</h1>
          <p className="text-lg opacity-80 leading-relaxed">
            "This app completely transformed how our team collaborates. The folder organization and instant sharing are game changers."
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
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Welcome back</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              New here?{" "}
              <Link className="text-blue-600 font-semibold hover:text-blue-500 transition-colors" to="/register">
                Create an account
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-[var(--border-color)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-[var(--text-tertiary)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-[var(--text-tertiary)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
