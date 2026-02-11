import { useContext } from "react";
// Sidebar Component
export default function Sidebar({ user, activeFolder, folders, onSelectFolder, onLogout }) {
  const isTeamWorkspace = activeFolder === 'team';
  const isPersonalWorkspace = activeFolder !== 'team';

  return (
    <div className="w-64 bg-[var(--bg-sidebar)] h-full flex flex-col border-r border-[var(--border-color)]">
      {/* User Profile */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--p-accent)] to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {user?.name?.[0] || "U"}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-semibold truncate text-[var(--text-primary)]">{user?.name}</div>
          <div className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        
        {/* Personal Workspace */}
        <div className="px-4 mb-2 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            Personal
        </div>
        <div className="px-2 space-y-0.5 mb-6">
             {/* All Notes */}
            <button
                onClick={() => onSelectFolder("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                activeFolder === ""
                    ? "bg-[var(--bg-active)] font-medium text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                }`}
            >
                <span className="w-4 text-center">🏠</span>
                All Notes
            </button>
            {/* Favorites */}
            <button
                onClick={() => onSelectFolder("favorites")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                activeFolder === "favorites"
                    ? "bg-[var(--bg-active)] font-medium text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                }`}
            >
                <span className="w-4 text-center">⭐</span>
                Favorites
            </button>
        </div>

        {/* Team Workspace (Only if user has a team) */}
        {user?.team && (
            <>
                <div className="px-4 mb-2 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Team Workspace
                </div>
                <div className="px-2 mb-6">
                    <button
                        onClick={() => onSelectFolder("team")}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                        activeFolder === "team"
                            ? "bg-[var(--bg-active)] font-medium text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                        <span className="w-4 text-center">👥</span>
                        Team Notes
                    </button>
                </div>
            </>
        )}

        {/* Folders (Tags) - Only show in Personal for now, or mix? Let's hide in Team for simplicity or show all. 
            For now, showing derived folders regardless of workspace, but filtering logic in Dashboard handles it. 
        */}
        {folders && folders.length > 0 && activeFolder !== 'team' && (
            <>
                <div className="px-4 mb-2 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider flex justify-between items-center group">
                <span>Folders</span>
                </div>
                <div className="space-y-0.5 px-2">
                    {folders.filter(f => f !== 'favorite').map((folder) => (
                        <button
                            key={folder}
                            onClick={() => onSelectFolder(folder)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                            activeFolder === folder
                                ? "bg-[var(--bg-active)] font-medium text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                            }`}
                        >
                            <span className="opacity-60 w-4 text-center">📁</span>
                            <span className="truncate">{folder}</span>
                        </button>
                    ))}
                </div>
            </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 text-[var(--p-danger)] hover:bg-red-50 transition-colors"
        >
          <span className="w-4 text-center">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
