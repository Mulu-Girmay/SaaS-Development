export default function NotesList({ notes, activeId, onSelect, onDelete }) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div
          key={note._id}
          className={`note-row ${activeId === note._id ? "active" : ""}`}
        >
          <button className="note-main" onClick={() => onSelect(note._id)}>
            <div className="note-title">{note.title}</div>
            <div className="note-snippet">
              {(note.content || "No content yet.").slice(0, 90)}
            </div>
            <div className="note-meta">
              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              {Array.isArray(note.tags) && note.tags.length > 0 && (
                <span className="note-tags">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </span>
              )}
            </div>
          </button>
          <button onClick={() => onDelete(note._id)} className="btn btn-secondary">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
