import api from "./axios";
export const getNotes = (params) => api.get("/notes", { params });
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post("/notes", data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const shareNote = (id, data) => api.post(`/notes/${id}/share`, data);
export const getNoteVersions = (id) => api.get(`/notes/${id}/versions`);
export const restoreNoteVersion = (id, versionId) =>
  api.post(`/notes/${id}/versions/${versionId}/restore`);
