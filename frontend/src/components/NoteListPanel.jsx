
export default function NoteListPanel({ notes, activeNoteId, onSelectNote, onCreateNote, searchQuery, setSearchQuery }) {
  
  // Format helper using native Date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        // Display "Today", "Yesterday", or "MMM DD"
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
        return "";
    }
  };

  return (
    <div className="pane-list">
      {/* Search Header */}
      <div className="p-4 border-b border-[var(--border-color)] space-y-3">
        <div className="flex items-center justify-between">
            <h2 className="text-h1">Notes</h2>
            <button onClick={onCreateNote} className="btn-icon hover:bg-[var(--bg-hover)] text-[var(--text-primary)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>
        </div>
        <input 
            type="text" 
            placeholder="Search..." 
            className="search-bar w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-sub">
            No notes found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {notes.map((note) => (
              <button
                key={note._id}
                onClick={() => onSelectNote(note._id)}
                className={`w-full text-left p-4 hover:bg-[var(--bg-hover)] transition-colors group ${
                  activeNoteId === note._id ? "bg-[var(--bg-active)]" : ""
                }`}
              >
                <div className={`font-semibold text-sm mb-1 ${activeNoteId === note._id ? "text-[var(--text-primary)]" : ""}`}>
                  {note.title || "Untitled Note"}
                </div>
                <div className="text-xs text-[var(--text-secondary)] line-clamp-2 h-8 mb-2 opacity-80">
                  {note.content?.replace(/[#*`]/g, '') || "No content"}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">
                        {formatDate(note.updatedAt)}
                    </span>
                    {note.tags?.includes('favorite') && (
                        <span title="Favorite">⭐</span>
                    )}
                    {note.collaborators && note.collaborators.length > 0 && (
                        <span title={`Shared with ${note.collaborators.length} users`} className="text-[var(--text-tertiary)] flex items-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </span>
                    )}
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex gap-1 overflow-hidden">
                            {note.tags.filter(t => t !== 'favorite').slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[10px] bg-[var(--border-color)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
