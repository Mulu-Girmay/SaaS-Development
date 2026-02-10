import api from "./axios";

export const getAnalyticsSummary = () => api.get("/analytics/summary");
export const getAuditLogs = () => api.get("/audit");
