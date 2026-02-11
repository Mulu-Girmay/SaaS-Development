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
} from "../api/notes";
import NotesList from "../components/NotesList";
import CreateNote from "../components/CreateNote";
import EditNote from "../components/EditNote";
import ShareNote from "../components/ShareNote";
import ViewNote from "../components/ViewNote";
import { updateNote, shareNote } from "../api/notes";
import NoteVersions from "../components/NoteVersions";
import InviteList from "../components/InviteList";
import { getInvites, acceptInvite, declineInvite } from "../api/invites";
import ActivityLog from "../components/ActivityLog";
import { getNotifications, markNotificationsRead } from "../api/notifications";
import TeamPanel from "../components/TeamPanel";
import SubscriptionPanel from "../components/SubscriptionPanel";
import AdminPanel from "../components/AdminPanel";
import { createTeam, getMyTeam, addTeamMember } from "../api/team";
import { getMySubscription, updatePlan } from "../api/subscription";
import { getAnalyticsSummary, getAuditLogs } from "../api/admin";

export default function Dashboard() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("auth"))?.user?.id;
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState("");
  const [invites, setInvites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team, setTeam] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadNotes = async () => {
    try {
      setError("");
      let res = await getNotes({
        q: search || undefined,
        tag: tag || undefined,
      });
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to load notes. Please try again.");
    }
  };
  const loadInvites = async () => {
    try {
      const res = await getInvites();
      setInvites(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };
  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };
  const loadTeam = async () => {
    try {
      const res = await getMyTeam();
      setTeam(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };
  const loadSubscription = async () => {
    try {
      const res = await getMySubscription();
      setSubscription(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };
  const loadAdminData = async () => {
    if (auth?.user?.role !== "admin") return;
    try {
      const [analyticsRes, auditRes] = await Promise.all([
        getAnalyticsSummary(),
        getAuditLogs(),
      ]);
      setAnalytics(analyticsRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      // ignore admin fetch errors for non-admins
    }
  };
  useEffect(() => {
    loadNotes();
    loadInvites();
    loadNotifications();
    loadTeam();
    loadSubscription();
    loadAdminData();
  }, [search, tag]);
  const handleCreate = async (data) => {
    try {
      await createNote(data);
      loadNotes();
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to create note. Please try again.");
    }
  };
  const handleSelect = async (id) => {
    try {
      const res = await getNote(id);
      setActiveNote(res.data);
      setIsEditing(false);
      setShowVersions(false);
      const versionsRes = await getNoteVersions(id);
      setVersions(versionsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to load note. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      loadNotes();
      setActiveNote(null);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to delete note. Please try again.");
    }
  };

  const canWrite = (note) => {
    if (!note || !userId) return false;
    return (
      note.user === userId ||
      note.collaborators?.some(
        (c) => c.user === userId && c.permission === "write"
      )
    );
  };

  const handleSave = async (id, data) => {
    try {
      await updateNote(id, data);
      await loadNotes();
      setIsEditing(false);
      const res = await getNote(id);
      setActiveNote(res.data);
      const versionsRes = await getNoteVersions(id);
      setVersions(versionsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to save note. Please try again.");
    }
  };

  const handleShare = async (data) => {
    try {
      await shareNote(activeNote._id, data);
      alert("Note shared");
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to share note. Please try again.");
    }
  };
  const handleRestore = async (versionId) => {
    if (!activeNote?._id) return;
    try {
      await restoreNoteVersion(activeNote._id, versionId);
      const res = await getNote(activeNote._id);
      setActiveNote(res.data);
      const versionsRes = await getNoteVersions(activeNote._id);
      setVersions(versionsRes.data);
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError("Failed to restore version. Please try again.");
    }
  };
  const handleInviteAccept = async (id) => {
    await acceptInvite(id);
    await loadInvites();
    await loadNotes();
  };
  const handleInviteDecline = async (id) => {
    await declineInvite(id);
    await loadInvites();
  };
  const handleMarkRead = async () => {
    await markNotificationsRead();
    await loadNotifications();
  };
  const handleCreateTeam = async (data) => {
    await createTeam(data);
    await loadTeam();
  };
  const handleAddMember = async (data) => {
    await addTeamMember(data);
    await loadTeam();
  };
  const handlePlanChange = async (plan) => {
    await updatePlan(plan);
    await loadSubscription();
  };
  const unreadCount = notifications.filter((n) => !n.read).length;
  const folderTags = Array.from(
    new Set(
      notes
        .flatMap((note) => (Array.isArray(note.tags) ? note.tags : []))
        .filter(Boolean)
    )
  );
  return (
    <div className="page app-page">
      <div className="app-shell">
        <header className="app-topbar">
          <div>
            <div className="section-title">Workspace</div>
            <h1 className="app-title">Notes Hub</h1>
            <p className="app-subtitle">
              Welcome back, {auth?.user?.name}. Capture updates and share
              progress with your team.
            </p>
          </div>
          <div className="app-topbar-actions">
            <div className="app-search">
              <input
                className="input"
                placeholder="Search notes, people, tags"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <button className="btn btn-secondary">Activity</button>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs font-bold rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </div>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <div className="app-body">
          <aside className="app-sidebar">
            <div className="panel panel-tight">
              <div className="section-title">Quick Capture</div>
              <CreateNote onCreate={handleCreate} />
            </div>

            <div className="panel panel-tight">
              <div className="section-title">Folders</div>
              <div className="folder-list">
                <button
                  className={`folder-item ${tag === "" ? "active" : ""}`}
                  onClick={() => setTag("")}
                >
                  All Notes
                  <span>{notes.length}</span>
                </button>
                {folderTags.map((folder) => (
                  <button
                    key={folder}
                    className={`folder-item ${tag === folder ? "active" : ""}`}
                    onClick={() => setTag(folder)}
                  >
                    {folder}
                    <span>
                      {
                        notes.filter((note) =>
                          Array.isArray(note.tags)
                            ? note.tags.includes(folder)
                            : false
                        ).length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel panel-tight">
              <div className="section-title">Notes</div>
              {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
              <div className="mb-4">
                <input
                  className="input"
                  placeholder="Filter by tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>
              <NotesList
                notes={notes}
                activeId={activeNote?._id}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </div>
          </aside>

          <main className="app-main panel">
            {activeNote ? (
              isEditing ? (
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
            ) : (
              <div className="empty-state">
                Select a note to view or create a new one.
              </div>
            )}

            {canWrite(activeNote) && (
              <div className="mt-6">
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="btn btn-accent btn-icon"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.6 13.5l6.8 3.9" />
                    <path d="M15.4 6.6L8.6 10.5" />
                  </svg>
                  Share
                </button>
                {showShare && <ShareNote onShare={handleShare} />}
              </div>
            )}

            {activeNote && (
              <div className="mt-8">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowVersions(!showVersions)}
                >
                  {showVersions ? "Hide History" : "View History"}
                </button>
                {showVersions && (
                  <div className="mt-4">
                    <NoteVersions
                      versions={versions}
                      onRestore={handleRestore}
                    />
                  </div>
                )}
              </div>
            )}
          </main>

          <aside className="app-right">
            <div className="panel panel-tight">
              <ActivityLog
                notifications={notifications}
                auditLogs={auditLogs}
                onMarkRead={handleMarkRead}
              />
            </div>
            <div className="panel panel-tight">
              <div className="section-title mb-3">Invites</div>
              <InviteList
                invites={invites}
                onAccept={handleInviteAccept}
                onDecline={handleInviteDecline}
              />
            </div>
            <div className="panel panel-tight">
              <TeamPanel
                team={team}
                onCreateTeam={handleCreateTeam}
                onAddMember={handleAddMember}
              />
            </div>
            <div className="panel panel-tight">
              <SubscriptionPanel
                subscription={subscription}
                onPlanChange={handlePlanChange}
              />
            </div>
            {auth?.user?.role === "admin" && (
              <div className="panel panel-tight">
                <AdminPanel analytics={analytics} auditLogs={auditLogs} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
