import { useState, useEffect } from "react";

export default function EditNote({ note, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  return (
    <div className="space-y-4">
      <div className="section-title">Editing</div>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        className="input h-48"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your update..."
      />

      <div className="flex gap-3">
        <button
          onClick={() => onSave(note._id, { title, content })}
          className="btn btn-primary"
        >
          Save
        </button>

        <button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
