import DOMPurify from "dompurify";
import { marked } from "marked";
import EmbeddedWhiteboard from "./EmbeddedWhiteboard";

export default function ViewNote({ note, canWrite, onEdit }) {
  if (!note) return null;

  // Function to render content with mixed markdown and whiteboards
  const renderContent = () => {
      if (!note.content) return null;
      
      // Regex to find [Whiteboard: {"document":...}]
      // Note: JSON inside might be complex, so simple regex might fail on nested brackets if we are not careful.
      // But we control the format. Let's assume we store it as `[Whiteboard: <base64_or_escaped_json>]`
      // For MVP, let's use a simpler marker `[Whiteboard:<ID>]` and store data in a separate map?
      // OR just rely on the fact that we will store encoded string.
      // Let's assume `[Whiteboard: ...]` where ... is JSON string.
      
      // better strategy:
      // Split by a unique delimiter.
      
      const parts = note.content.split(/(\[Whiteboard:.*?\])/s);
      
      return parts.map((part, index) => {
          if (part.startsWith("[Whiteboard:")) {
              try {
                  const dataStr = part.substring(12, part.length - 1);
                  // It might be URL encoded to avoid syntax clashes
                  const data = decodeURIComponent(dataStr);
                  return (
                    <div key={index} className="my-8 border rounded-lg shadow-sm">
                        <EmbeddedWhiteboard initialData={data} readOnly={true} />
                    </div>
                  );
              } catch (e) {
                  return <div key={index} className="text-red-500">[Invalid Whiteboard Data]</div>;
              }
          } else {
              // Render Markdown
               return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(part || "")),
                  }}
                />
              );
          }
      });
  };

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
        {renderContent()}
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
