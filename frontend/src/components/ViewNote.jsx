export default function ViewNote({ note, canWrite, onEdit }) {
  if (!note) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <p className="mt-4 whitespace-pre-wrap">{note.content}</p>

      {canWrite && (
        <button
          onClick={onEdit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
}
