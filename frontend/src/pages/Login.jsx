import React from 'react'
import { useState , useContext } from 'react'
import api from "../api/axios"
import { AuthContext } from '../context/AuthContext'

import { useNavigate } from 'react-router-dom'
export default function Login() {
    const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
        console.log(res.data)
      login(res.data);
    navigate("/dashboard")
      alert("Login successful");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
      <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  )
}

