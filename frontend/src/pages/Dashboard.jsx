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
  }, [notes]);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome, {auth?.user?.name}</p>
      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-1">
          <CreateNote onCreate={handleCreate} />
          <NotesList
            notes={notes}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </div>

        <div className="col-span-2 border p-4 rounded">
          {activeNote ? (
            <>
              <h2 className="text-xl font-bold">{activeNote.title}</h2>
              <p className="mt-2">{activeNote.content}</p>
            </>
          ) : (
            <p>Select a note to view</p>
          )}
        </div>
      </div>
      {activeNote &&
        (isEditing ? (
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
        ))}
      {canWrite(activeNote) && (
        <button
          onClick={() => setShowShare(!showShare)}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
        >
          Share
        </button>
      )}

      {showShare && <ShareNote onShare={handleShare} />}

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
