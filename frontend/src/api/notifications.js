import api from "./axios";

export const getNotifications = () => api.get("/notifications");
export const markNotificationsRead = () => api.post("/notifications/read");
