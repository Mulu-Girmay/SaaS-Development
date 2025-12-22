import { useState } from "react";

export default function ShareNote({ onShare }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");

  const submit = (e) => {
    e.preventDefault();
    onShare({ email, permission });
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="space-y-2 mt-4">
      <h3 className="font-semibold">Share Note</h3>

      <input
        type="email"
        placeholder="User email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
      >
        <option value="read">Read</option>
        <option value="write">Write</option>
      </select>

      <button className="bg-purple-500 text-white px-4 py-2 rounded">
        Share
      </button>
    </form>
  );
}
