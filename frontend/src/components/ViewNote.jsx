import DOMPurify from "dompurify";
import { marked } from "marked";

export default function ViewNote({ note, canWrite, onEdit }) {
  if (!note) return null;

  return (
    <div className="space-y-4">
      <div className="section-title">Selected Note</div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{note.title}</h2>
          <p className="text-sm text-slate-500 mt-1">
            Last updated {new Date(note.updatedAt).toLocaleString()}
          </p>
        </div>
        {canWrite && (
          <button onClick={onEdit} className="btn btn-secondary">
            Edit
          </button>
        )}
      </div>
      <div className="rounded-2xl bg-white/70 border border-slate-200 p-5 markdown">
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
