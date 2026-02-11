import DOMPurify from "dompurify";
import { marked } from "marked";

export default function ViewNote({ note, canWrite, onEdit }) {
  if (!note) return null;

  return (
    <div className="space-y-4">
      <div className="note-header">
        <div>
          <div className="section-title">Selected Note</div>
          <h2 className="text-2xl font-semibold">{note.title}</h2>
          <p className="text-sm text-slate-500 mt-1">
            Last updated {new Date(note.updatedAt).toLocaleString()}
          </p>
        </div>
        {canWrite && (
          <button onClick={onEdit} className="btn btn-secondary btn-icon">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
            Edit
          </button>
        )}
      </div>
      <div className="note-body markdown">
        <div
          className="text-slate-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(note.content || "")),
          }}
        />
        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
