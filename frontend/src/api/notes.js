import api from "./axios";
export const getNotes = () => api.get("/notes");
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post("/notes", data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const shareNote = (id, data) => api.post(`/notes/${id}/share`, data);
