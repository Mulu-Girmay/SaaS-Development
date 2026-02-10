export default function NotesList({ notes, onSelect, onDelete }) {
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note._id}
          className="note-card"
        >
          <div className="flex-1">
            <span
              className="cursor-pointer font-semibold text-slate-800"
              onClick={() => onSelect(note._id)}
            >
              {note.title}
            </span>
            {Array.isArray(note.tags) && note.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onDelete(note._id)} className="btn btn-secondary">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
