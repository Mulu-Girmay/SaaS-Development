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
      <div className="rounded-2xl bg-white/70 border border-slate-200 p-5">
        <p className="whitespace-pre-wrap text-slate-700">{note.content}</p>
      </div>
    </div>
  );
}
