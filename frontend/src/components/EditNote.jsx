import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

export default function EditNote({ note, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(Array.isArray(note.tags) ? note.tags.join(", ") : "");
    }
  }, [note]);

  const applyFormat = (type) => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || "text";
    let formatted = selected;

    if (type === "bold") formatted = `**${selected}**`;
    if (type === "italic") formatted = `*${selected}*`;
    if (type === "underline") formatted = `<u>${selected}</u>`;
    if (type === "strike") formatted = `~~${selected}~~`;
    if (type === "code") formatted = `\`${selected}\``;
    if (type === "list") formatted = `- ${selected}`;

    const next = content.slice(0, start) + formatted + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formatted.length;
    });
  };

  return (
    <div className="space-y-4">
      <div className="section-title">Editing</div>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />

      <div className="flex items-center justify-between">
        <div className="section-title">Content</div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowPreview((prev) => !prev)}
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>
      {!showPreview && (
        <div className="note-toolbar">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("bold")}
          >
            Bold
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("italic")}
          >
            Italic
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("underline")}
          >
            Underline
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("strike")}
          >
            Strike
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("code")}
          >
            Code
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat("list")}
          >
            Bullet
          </button>
        </div>
      )}
      {showPreview ? (
        <div
          className="rounded-2xl bg-white/70 border border-slate-200 p-5 markdown"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(content || "")),
          }}
        />
      ) : (
        <textarea
          ref={textAreaRef}
          className="input h-56"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your update..."
        />
      )}
      <input
        className="input"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            const parsedTags = tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            onSave(note._id, { title, content, tags: parsedTags });
          }}
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
