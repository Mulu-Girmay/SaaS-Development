import DOMPurify from "dompurify";
import { marked } from "marked";

export default function ViewNote({ note, canWrite, onEdit }) {
  if (!note) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-2">{note.title}</h2>
          <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            <span>Last updated {new Date(note.updatedAt).toLocaleString()}</span>
            {canWrite && (
                 <button onClick={onEdit} className="hover:text-[var(--text-primary)] font-medium">
                    Edit
                 </button>
            )}
          </div>
        </div>
      </div>

      <div className="markdown-editor prose prose-slate max-w-none text-lg leading-relaxed">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(note.content || "")),
          }}
        />
      </div>

      {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
            <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                <span
                    key={tag}
                    className="px-2 py-1 bg-[var(--bg-active)] text-[var(--text-secondary)] text-xs rounded-md"
                >
                    #{tag}
                </span>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
