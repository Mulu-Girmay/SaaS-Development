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
    if (type === "list") formatted = `\n- ${selected}`;
    if (type === "h1") formatted = `\n# ${selected}`;
    if (type === "h2") formatted = `\n## ${selected}`;
    if (type === "h3") formatted = `\n### ${selected}`;

    const next = content.slice(0, start) + formatted + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formatted.length;
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <input
        className="text-4xl font-bold border-none outline-none bg-transparent placeholder-gray-300 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        autoFocus
      />

      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 mb-4 sticky top-0 bg-[var(--bg-panel)] z-10 pt-2">
          {!showPreview && (
            <div className="flex gap-1 flex-wrap">
              {['h1', 'h2', 'h3'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyFormat(t)}
                  className="px-2 py-1 text-xs uppercase font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded"
                >
                  {t}
                </button>
              ))}
              <div className="w-px h-4 bg-[var(--border-color)] mx-1 self-center"></div>
              {['bold', 'italic', 'code', 'list'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyFormat(t)}
                  className="px-2 py-1 text-xs uppercase font-semibold text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] rounded"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div className="flex-1"></div>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {showPreview ? (
            <div
            className="markdown-editor prose prose-slate max-w-none flex-1 overflow-y-auto"
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(content || "")),
            }}
            />
        ) : (
            <textarea
            ref={textAreaRef}
            className="w-full h-full flex-1 resize-none border-none outline-none bg-transparent text-lg leading-relaxed font-mono text-[var(--text-primary)]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            />
        )}
      </div>

      <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
         <input
            className="w-full text-sm text-[var(--text-secondary)] bg-transparent outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags..."
        />
        <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="btn-ghost text-sm">
            Cancel
            </button>
            <button
            onClick={() => {
                const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
                onSave(note._id, { title, content, tags: parsedTags });
            }}
            className="btn-primary rounded-md text-sm"
            >
            Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
