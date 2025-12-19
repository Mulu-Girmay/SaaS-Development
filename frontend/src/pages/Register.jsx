import React from 'react'
import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const navigate = useNavigate()
  const [form , setForm] = useState({
    name:"",
    email:"",
    password:""
  })
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async(e)=>{
    e.preventDefault()
try{
await api.post("/auth/register",form)
alert("Registration successful. Please login.");
      navigate("/login");
}catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  }
  return (
   <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded shadow-md w-80">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <input
          name="name"
          placeholder="Name"
          className="border p-2 mb-3 w-full"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 mb-4 w-full"
          onChange={handleChange}
        />

        <button className="bg-green-500 text-white p-2 w-full rounded">
          Register
        </button>
      </form>
    </div>
  )
}

