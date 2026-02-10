export default function NoteVersions({ versions, onRestore }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="empty-state">
        No versions yet. Edits will show up here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <div key={version._id} className="note-card">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-800">
              {version.title || "Untitled"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {version.editedBy?.name
                ? `Edited by ${version.editedBy.name}`
                : "Edited"}
              {" · "}
              {new Date(version.createdAt).toLocaleString()}
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => onRestore(version._id)}
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
