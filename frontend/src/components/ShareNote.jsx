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
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <div className="section-title">Collaborate</div>
        <h3 className="text-lg font-semibold mt-1">Share this note</h3>
        <p className="text-sm text-slate-500 mt-1">
          Invite a teammate and set their permission.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="email"
          placeholder="User email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="input"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="read">Read</option>
          <option value="write">Write</option>
        </select>
      </div>

      <button className="btn btn-accent">Send Invite</button>
    </form>
  );
}
