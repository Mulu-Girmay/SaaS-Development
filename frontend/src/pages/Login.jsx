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
    <div className="page">
      <div className="auth-shell">
        <div className="auth-hero">
          <h1>Your notes. Shared, secure, and fast.</h1>
          <p>
            Keep ideas organized, share with your team, and never lose track of
            changes. Welcome back.
          </p>
        </div>
        <div className="card">
          <div className="section-title">Sign In</div>
          <h2 className="text-2xl font-semibold mt-2">Login</h2>
          <p className="text-sm text-slate-500 mt-2">
            New here?{" "}
            <Link className="text-slate-900 font-semibold" to="/register">
              Create an account
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-full">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
