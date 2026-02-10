import { useState } from "react";

export default function CreateNote({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onCreate({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        placeholder="Title"
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="input h-28"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="btn btn-primary w-full">Create Note</button>
    </form>
  );
}
