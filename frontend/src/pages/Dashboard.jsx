import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import React from "react";
import { getNotes, getNote, createNote, deleteNote } from "../api/notes";
import NotesList from "../components/NotesList";
import CreateNote from "../components/CreateNote";
import EditNote from "../components/EditNote";
import ShareNote from "../components/ShareNote";
import ViewNote from "../components/ViewNote";
import { updateNote, shareNote } from "../api/notes";

export default function Dashboard() {
  const { auth, logout } = useContext(AuthContext);
  const userId = JSON.parse(localStorage.getItem("auth"))?.user?.id;
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const loadNotes = async () => {
    let res = await getNotes();
    setNotes(res.data);
  };
  useEffect(() => {
    loadNotes();
  }, []);
  const handleCreate = async (data) => {
    await createNote(data);
    loadNotes();
  };
  const handleSelect = async (id) => {
    const res = await getNote(id);
    setActiveNote(res.data);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
    setActiveNote(null);
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
    await updateNote(id, data);
    await loadNotes();
    setIsEditing(false);
  };

  const handleShare = async (data) => {
    await shareNote(activeNote._id, data);
    alert("Note shared");
  };
  return (
    <div className="page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <div className="section-title">Workspace</div>
            <h1 className="text-3xl font-semibold mt-2">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {auth?.user?.name}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="dashboard-grid">
          <aside className="panel space-y-6">
            <div>
              <div className="section-title">Create</div>
              <CreateNote onCreate={handleCreate} />
            </div>
            <div>
              <div className="section-title mb-3">Your Notes</div>
              <NotesList
                notes={notes}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </div>
          </aside>

          <section className="panel">
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
                  className="btn btn-accent"
                >
                  Share
                </button>
                {showShare && <ShareNote onShare={handleShare} />}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
