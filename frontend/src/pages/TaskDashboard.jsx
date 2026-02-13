import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotes, updateNote } from "../api/notes";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar"; // Reusing Sidebar, but needs props
import { useAuth } from "../context/AuthContext";

export default function TaskDashboard() {
  const { auth, logout } = useAuth();
  const user = auth?.user;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getNotes(); 
      const allNotes = res.data;
      setNotes(allNotes);
      
      const extractedTasks = [];
      allNotes.forEach(note => {
        if (!note.content) return;
        const lines = note.content.split('\n');
        lines.forEach((line, index) => {
          // Match "- [ ]" or "- [x]" or "* [ ]"
          const match = line.match(/^(\s*)[-*]\s+\[([ xX])\]\s+(.*)$/);
          if (match) {
            extractedTasks.push({
              id: `${note._id}-${index}`,
              noteId: note._id,
              noteTitle: note.title,
              text: match[3],
              completed: match[2].toLowerCase() === 'x',
              lineIndex: index,
              rawLine: line
            });
          }
        });
      });
      
      setTasks(extractedTasks);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    // Optimistic update
    const newCompleted = !task.completed;
    const newTasks = tasks.map(t => 
        t.id === task.id ? { ...t, completed: newCompleted } : t
    );
    setTasks(newTasks);

    try {
        // Find the note
        const note = notes.find(n => n._id === task.noteId);
        if (!note) return;

        // Update content
        const lines = note.content.split('\n');
        if (lines[task.lineIndex] !== task.rawLine) {
            // Line moved or changed, abort to be safe or try to find it
            console.warn("Line mismatch, not updating");
            alert("Note content changed, please refresh.");
            loadTasks();
            return;
        }

        const newLine = task.rawLine.replace(/\[([ xX])\]/, `[${newCompleted ? 'x' : ' '}]`);
        lines[task.lineIndex] = newLine;
        const newContent = lines.join('\n');

        await updateNote(task.noteId, { ...note, content: newContent });
        
        // Update local note state so next toggle works
        setNotes(notes.map(n => n._id === task.noteId ? { ...n, content: newContent } : n));
        
        // Update task rawLine 
         setTasks(newTasks.map(t => 
            t.id === task.id ? { ...t, rawLine: newLine } : t
        ));

    } catch (err) {
        console.error("Failed to update task", err);
        // Revert
        loadTasks();
    }
  };

  // Group by Note
  const tasksByNote = tasks.reduce((acc, task) => {
    if (!acc[task.noteTitle]) acc[task.noteTitle] = [];
    acc[task.noteTitle].push(task);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-gray-50">
        {/* We need a Sidebar here for consistency, but Sidebar needs props. 
            For now, we can either render a simplified Sidebar or just a Back button.
            Given the architecture, let's just do a simple layout.
        */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
            <h1 className="text-xl font-bold mb-6">Task Dashboard</h1>
            <nav className="space-y-2">
                <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
                    ⬅ Back to Notes
                </Link>
                <div className="px-3 py-2 font-medium text-blue-600 bg-blue-50 rounded">
                    Example: Tasks
                </div>
            </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
            {loading ? (
                <div>Loading...</div>
            ) : tasks.length === 0 ? (
                <div className="text-gray-500">No tasks found. Add <code>- [ ] Task</code> to your notes!</div>
            ) : (
                Object.entries(tasksByNote).map(([noteTitle, noteTasks]) => (
                    <div key={noteTitle} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">{noteTitle}</h3>
                        <div className="space-y-3">
                            {noteTasks.map(task => (
                                <div key={task.id} className="flex items-start gap-3 group">
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={() => toggleTask(task)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                         <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {task.text}
                                         </span>
                                         <Link to={`/dashboard?note=${task.noteId}`} className="ml-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 hover:underline">
                                            Open Note
                                         </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
