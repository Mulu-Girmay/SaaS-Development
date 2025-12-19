import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React from 'react'

export default function  Dashboard(){
  const { auth, logout } = useContext(AuthContext);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome, {auth?.user?.name}</p>

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

