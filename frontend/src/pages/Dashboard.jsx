import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  getNoteVersions,
  restoreNoteVersion,
  updateNote,
  shareNote
} from "../api/notes";
import { getInvites, acceptInvite, declineInvite } from "../api/invites";
import { getNotifications, markNotificationsRead } from "../api/notifications";
import { createTeam, getMyTeam, addTeamMember } from "../api/team";
import { getMySubscription, updatePlan } from "../api/subscription";
import { getAnalyticsSummary, getAuditLogs } from "../api/admin";

// New Components
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import NoteListPanel from "../components/NoteListPanel";
import RightPanel from "../components/RightPanel";

// Content Components
import EditNote from "../components/EditNote";
import ViewNote from "../components/ViewNote";
import ShareNote from "../components/ShareNote";
import NoteVersions from "../components/NoteVersions";

export default function Dashboard() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = auth?.user?.id || JSON.parse(localStorage.getItem("auth"))?.user?.id;

  // -- State --
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [search, setSearch] = useState("");
  
  // Navigation State
  const [activeFolder, setActiveFolder] = useState(""); // "" = All, "favorites" = Favorites, "tagName" = Folder
  
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState("");
  
  // Right Panel Data
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [invites, setInvites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team, setTeam] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // -- Loading --
  const loadNotes = async () => {
    try {
      setError("");
      // API doesn't support advanced filtering yet, so we filter mainly on client for now 
      // OR pass 'tag' if it's a folder. For favorites, we handle it client side or specific tag.
      let params = { q: search || undefined };
      
      if (activeFolder === "team") {
        params.type = "team";
      } else if (activeFolder && activeFolder !== "favorites") {
        params.tag = activeFolder;
      }
      
      let res = await getNotes(params);
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401) return handleLogout();
      setError("Failed to load notes.");
    }
  };

  const loadAllAuxData = async () => {
    try {
        const [inv, notif, tm, sub] = await Promise.all([
            getInvites(),
            getNotifications(),
            getMyTeam(),
            getMySubscription()
        ]);
        setInvites(inv.data);
        setNotifications(notif.data);
        setTeam(tm.data);
        setSubscription(sub.data);

        if (auth?.user?.role === "admin") {
            const [an, aud] = await Promise.all([getAnalyticsSummary(), getAuditLogs()]);
            setAnalytics(an.data);
            setAuditLogs(aud.data);
        }
    } catch (err) {
        if (err.response?.status === 401) return handleLogout();
        console.error("Aux data load error", err);
    }
  };

  useEffect(() => {
    if (!userId) {
         // navigate("/login");
    }
    loadNotes();
    loadAllAuxData();
  }, [search, activeFolder, userId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -- Computed Data --
  // Derive folders from tags across all notes (fetch all notes first or just rely on current loaded ones)
  // Ideally, we'd have an API endpoint for /tags, but we can compute it from `notes` if we load all.
  // For now, let's assume `notes` contains enough data or we fetch unique tags separately. 
  // We will compute from current `notes` for simplicity, though this only works if "All Notes" is selected.
  // To fix this proper, we'd need a `getTags` API. We'll stick to client-side derivation from visible notes for now.
  const folders = Array.from(new Set(notes.flatMap(n => n.tags || []))).sort();

  // Filter notes for display
  const displayedNotes = notes.filter(note => {
      if (activeFolder === "team") return true; // Already filtered by API
      if (activeFolder === "favorites") {
          return note.tags?.includes("favorite");
      }
      // Tag filtering is handled by API reload, but search is client side if API doesn't handle partials well
      // The API call in loadNotes handles `tag` and `q` params, so `notes` is already filtered.
      return true;
  });

  // -- Handlers --
  const handleCreate = async () => {
    try {
      // Create a blank note immediately
      const isTeam = activeFolder === 'team';
      const res = await createNote({ 
          title: isTeam ? "Untitled Team Note" : "Untitled Note", 
          content: "", 
          tags: activeFolder && activeFolder !== "favorites" && activeFolder !== "team" ? [activeFolder] : [],
          isTeamNote: isTeam
      });
      
      // Refresh list
      await loadNotes();
      
      // Select the new note and start editing
      setActiveNote(res.data);
      setIsEditing(true); 
    } catch (err) {
      console.error(err);
      setError("Failed to create note.");
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await getNote(id);
      setActiveNote(res.data);
      setIsEditing(false);
      setShowVersions(false);
      setShowShare(false);
      // versions
      getNoteVersions(id).then(r => setVersions(r.data)).catch(() => {});
    } catch (err) {
      setError("Failed to load note details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id);
      await loadNotes();
      if (activeNote?._id === id) setActiveNote(null);
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  const handleSave = async (id, data) => {
    try {
      await updateNote(id, data);
      await loadNotes(); 
      const res = await getNote(id);
      setActiveNote(res.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save.");
    }
  };

  const toggleFavorite = async (note) => {
      if (!note) return;
      const isFav = note.tags?.includes("favorite");
      let newTags = note.tags || [];
      
      if (isFav) {
          newTags = newTags.filter(t => t !== "favorite");
      } else {
          newTags = [...newTags, "favorite"];
      }
      
      try {
          // Optimistic update
          setActiveNote({ ...note, tags: newTags });
          await updateNote(note._id, { ...note, tags: newTags });
          await loadNotes();
      } catch (err) {
          setError("Failed to update favorite status");
          // Revert on fail
          setActiveNote(note); 
      }
  };

  // -- Aux Handlers --
  const handleRestore = async (versionId) => {
    if (!activeNote?._id) return;
    try {
      await restoreNoteVersion(activeNote._id, versionId);
      handleSelect(activeNote._id);
    } catch (err) {
      setError("Failed to restore.");
    }
  };

  const canWrite = (note) => {
    if (!note || !userId) return false;
    const uid = String(userId);
    // Check owner
    if (String(note.user) === uid) return true;
    // Check collaborators
    return note.collaborators?.some((c) => String(c.user) === uid && c.permission === "write");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <Sidebar 
        user={auth?.user} 
        activeFolder={activeFolder} 
        folders={folders}
        onSelectFolder={setActiveFolder}
        onLogout={handleLogout}
      />
      
      <NoteListPanel 
        notes={displayedNotes}
        activeNoteId={activeNote?._id}
        onSelectNote={handleSelect}
        onCreateNote={handleCreate}
        searchQuery={search}
        setSearchQuery={setSearch}
      />

      <div className="pane-editor">
        {/* Editor Top Bar */}
        {activeNote && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                 
                 {/* Favorite Toggle */}
                 {canWrite(activeNote) && (
                    <button 
                        onClick={() => toggleFavorite(activeNote)}
                        className={`btn-icon transition-colors ${activeNote.tags?.includes("favorite") ? "text-[var(--p-warning)]" : "text-[var(--text-tertiary)] hover:text-[var(--p-warning)]"}`}
                        title="Toggle Favorite"
                    >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill={activeNote.tags?.includes("favorite") ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                 )}

                 {/* Delete Button */}
                 {canWrite(activeNote) && (
                    <button 
                        onClick={() => handleDelete(activeNote._id)}
                        className="btn-icon text-[var(--text-tertiary)] hover:text-[var(--p-danger)]"
                        title="Delete Note"
                    >
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                 )}

                 {/* Separator */}
                 <div className="w-px h-6 bg-[var(--border-color)] mx-1"></div>

                 {/* Share Button (Only Owner/Write) */}
                 {canWrite(activeNote) && (
                    <div className="relative">
                        <button 
                            onClick={() => setShowShare(!showShare)} 
                            className="btn-ghost rounded-md text-sm border border-[var(--border-color)] bg-white shadow-sm"
                        >
                            Share
                        </button>
                        {showShare && (
                            <div className="absolute right-0 top-10 w-72 bg-white border border-[var(--border-color)] shadow-xl rounded-lg p-4 z-50">
                                <ShareNote 
                                    onShare={async (data) => {
                                        await shareNote(activeNote._id, data);
                                        setShowShare(false);
                                        alert("Shared!");
                                    }}
                                    onClose={() => setShowShare(false)} 
                                />
                            </div>
                        )}
                    </div>
                 )}

                 {/* History Toggle */}
                 <button 
                    onClick={() => setShowVersions(!showVersions)}
                    className="btn-icon text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    title="History"
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                 </button>

                 {/* Info Toggle */}
                 <button 
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className={`btn-icon ${unreadCount > 0 ? "text-[var(--p-warning)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"}`}
                    title="Information"
                 >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                 </button>
            </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto">
            {activeNote ? (
                <div className="max-w-3xl mx-auto min-h-full p-12 relative">
                     {showVersions ? (
                        <NoteVersions 
                            versions={versions} 
                            onRestore={handleRestore} 
                            onClose={() => setShowVersions(false)}
                        />
                     ) : (
                        isEditing && canWrite(activeNote) ? (
                            <EditNote 
                                note={activeNote} 
                                onSave={handleSave} 
                                onCancel={() => setIsEditing(false)} 
                            />
                        ) : (
                            <ViewNote 
                                note={activeNote} 
                                canWrite={canWrite(activeNote)} 
                                onEdit={() => setIsEditing(true)} 
                            />
                        )
                     )}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                    <div className="text-4xl mb-4 text-[var(--border-color)]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <p>Select a note or create a new one.</p>
                </div>
            )}
        </div>

        {/* Floating Right Panel */}
        {showRightPanel && (
            <RightPanel 
                user={auth?.user}
                notifications={notifications}
                auditLogs={auditLogs}
                invites={invites}
                team={team}
                subscription={subscription}
                analytics={analytics}
                onMarkRead={() => { markNotificationsRead().then(loadAllAuxData) }}
                onAcceptInvite={(id) => acceptInvite(id).then(loadAllAuxData)}
                onDeclineInvite={(id) => declineInvite(id).then(loadAllAuxData)}
                onCreateTeam={(d) => createTeam(d).then(loadAllAuxData)}
                onAddMember={(d) => addTeamMember(d).then(loadAllAuxData)}
                onPlanChange={(p) => updatePlan(p).then(loadAllAuxData)}
                onClose={() => setShowRightPanel(false)}
            />
        )}
      </div>
    </Layout>
  );
}
