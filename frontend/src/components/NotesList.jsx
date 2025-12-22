export default function NotesList({ notes, onSelect, onDelete }) {
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note._id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <span
            className="cursor-pointer font-medium"
            onClick={() => onSelect(note._id)}
          >
            {note.title}
          </span>

          <button onClick={() => onDelete(note._id)} className="text-red-500">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
