import { useState } from "react";

export default function ShareNote({ onShare, onClose }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");

  const submit = (e) => {
    e.preventDefault();
    onShare({ email, permission });
    setEmail("");
  };

  return (
    <div className="relative">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <form onSubmit={submit} className="mt-2 space-y-4">
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

      <button className="btn btn-primary w-full">Send Invite</button>
      </form>
    </div>
  );
}
