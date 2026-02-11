import React from "react";

export default function NoteVersions({ versions, onRestore, onClose }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
        <h3 className="text-lg font-semibold">Version History</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-hover)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {(!versions || versions.length === 0) ? (
        <div className="empty-state text-[var(--text-tertiary)] text-center py-8">
          No versions yet. Edits will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <div key={version._id} className="p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-panel)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {version.title || "Untitled"}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {version.editedBy?.name
                      ? `Edited by ${version.editedBy.name}`
                      : "Edited"}
                    {" · "}
                    {new Date(version.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => onRestore(version._id)}
                >
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
