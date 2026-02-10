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
    <div className="page">
      <div className="auth-shell">
        <div className="auth-hero">
          <h1>Build your second brain.</h1>
          <p>
            Capture ideas, organize notes, and collaborate in real time. Create
            your account to get started.
          </p>
        </div>
        <div className="card">
          <div className="section-title">Create Account</div>
          <h2 className="text-2xl font-semibold mt-2">Register</h2>
          <p className="text-sm text-slate-500 mt-2">
            Already have an account?{" "}
            <Link className="text-slate-900 font-semibold" to="/login">
              Sign in
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              name="name"
              placeholder="Name"
              className="input"
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              onChange={handleChange}
            />

            <button className="btn btn-accent w-full">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
